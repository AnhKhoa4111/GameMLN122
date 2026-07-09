"use client"

import { useEffect, useState } from "react"
import AdminLeaderboard from "@/components/admin/AdminLeaderboard"
import StartGameButton from "@/components/admin/StartGameButton"
import Button from "@/components/ui/Button"
import Card from "@/components/ui/Card"
import { supabaseBrowser } from "@/lib/client/supabase"
import type { GameState } from "@/lib/types/game"
import type { Player } from "@/lib/types/player"
import { formatClockTime } from "@/lib/utils"

export default function AdminClient() {
  const [adminEmail, setAdminEmail] = useState("")
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [players, setPlayers] = useState<Player[]>([])
  const [game, setGame] = useState<GameState | null>(null)
  const [message, setMessage] = useState("")
  const [isBusy, setIsBusy] = useState(false)

  async function loadState() {
    const response = await fetch("/api/lobby-state")
    const data = await response.json()

    if (response.ok) {
      setPlayers(data.players)
      setGame(data.game)
    }
  }

  async function verifyAdminSession(accessToken: string) {
    const response = await fetch("/api/admin-login", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    const data = await response.json()

    if (!response.ok) {
      setIsUnlocked(false)
      setAdminEmail("")
      setMessage(data.error ?? "Email này không có quyền admin.")
      return false
    }

    setIsUnlocked(true)
    setAdminEmail(data.email ?? "")
    setMessage("")
    await loadState()
    return true
  }

  useEffect(() => {
    async function checkSession() {
      const { data } = await supabaseBrowser.auth.getSession()
      const accessToken = data.session?.access_token

      if (accessToken) {
        await verifyAdminSession(accessToken)
      }

      setIsCheckingAuth(false)
    }

    checkSession()

    const { data: subscription } = supabaseBrowser.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.access_token) {
          await verifyAdminSession(session.access_token)
        } else {
          setIsUnlocked(false)
          setAdminEmail("")
          setPlayers([])
          setGame(null)
        }
      }
    )

    return () => subscription.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!isUnlocked) return

    loadState()
    const timer = window.setInterval(loadState, 3000)
    return () => window.clearInterval(timer)
  }, [isUnlocked])

  async function signInWithGoogle() {
    setIsBusy(true)
    setMessage("")

    const { error } = await supabaseBrowser.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/admin`,
      },
    })

    if (error) {
      setMessage("Không thể mở đăng nhập Google.")
      setIsBusy(false)
    }
  }

  async function signOutAdmin() {
    await supabaseBrowser.auth.signOut()
    setIsUnlocked(false)
    setAdminEmail("")
    setPlayers([])
    setGame(null)
    setMessage("")
  }

  async function postAdminAction(url: string, successMessage: string) {
    setIsBusy(true)
    setMessage("")

    try {
      const { data } = await supabaseBrowser.auth.getSession()
      const accessToken = data.session?.access_token

      if (!accessToken) {
        setMessage("Bạn cần đăng nhập lại bằng Google.")
        return
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      const responseData = await response.json()

      if (!response.ok) {
        setMessage(responseData.error ?? "Thao tác thất bại.")
        return
      }

      setMessage(successMessage)
      await loadState()
    } catch {
      setMessage("Không thể kết nối database.")
    } finally {
      setIsBusy(false)
    }
  }

  if (isCheckingAuth) {
    return (
      <main className="min-h-screen bg-[var(--game-bg)] px-4 py-10 text-[var(--game-white)]">
        <Card className="mx-auto max-w-xl">
          <p className="text-xl font-black text-[var(--game-yellow)]">
            Đang kiểm tra quyền admin...
          </p>
        </Card>
      </main>
    )
  }

  if (!isUnlocked) {
    return (
      <main className="min-h-screen bg-[var(--game-bg)] px-4 py-10 text-[var(--game-white)]">
        <Card className="mx-auto max-w-xl">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-[var(--game-yellow)]">
            Admin locked
          </p>
          <h1 className="mt-3 text-4xl font-black">Đăng nhập admin</h1>
          <p className="mt-3 font-bold text-white/75">
            Chỉ email nằm trong danh sách admin mới mở được trang điều khiển.
          </p>

          <Button
            disabled={isBusy}
            onClick={signInWithGoogle}
            type="button"
            className="mt-6 w-full"
          >
            {isBusy ? "Đang mở Google..." : "Đăng nhập bằng Google"}
          </Button>

          {message && <p className="mt-4 font-bold text-red-100">{message}</p>}
        </Card>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[var(--game-bg)] px-4 py-10 text-[var(--game-white)]">
      <Card className="mx-auto max-w-4xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[var(--game-yellow)]">
              Admin
            </p>
            <h1 className="mt-3 text-4xl font-black">Điều khiển game</h1>
            <p className="mt-2 font-bold text-white/75">
              Đang đăng nhập: {adminEmail}
            </p>
          </div>

          <Button onClick={signOutAdmin} type="button" variant="secondary">
            Đăng xuất
          </Button>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <StartGameButton
            isBusy={isBusy}
            onStart={() => postAdminAction("/api/start-game", "Game đã bắt đầu.")}
          />
          <Button
            disabled={isBusy}
            onClick={() => postAdminAction("/api/reset-game", "Đã reset game.")}
            variant="danger"
          >
            Reset
          </Button>
        </div>

        {message && <p className="mt-4 font-bold text-[var(--game-yellow)]">{message}</p>}

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <Stat label="Trạng thái" value={game?.is_started ? "Đã bắt đầu" : "Đang chờ"} />
          <Stat label="Người chơi" value={String(players.length)} />
          <Stat label="Start time" value={formatClockTime(game?.started_at ?? null)} />
        </div>

        <AdminLeaderboard players={players} />
      </Card>
    </main>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-4 border-[var(--game-white)] bg-[var(--game-bg-light)] p-4">
      <div className="text-sm font-bold text-white/70">{label}</div>
      <div className="mt-1 text-xl font-black">{value}</div>
    </div>
  )
}
