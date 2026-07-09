"use client"

import { useCallback, useEffect, useState } from "react"
import type { Session } from "@supabase/supabase-js"
import AdminLeaderboard from "@/components/admin/AdminLeaderboard"
import StartGameButton from "@/components/admin/StartGameButton"
import Button from "@/components/ui/Button"
import { supabaseBrowser } from "@/lib/client/supabase"
import type { GameState } from "@/lib/types/game"
import type { Player } from "@/lib/types/player"

type AdminStatus = "checking" | "signed-out" | "verifying" | "allowed" | "denied"

export default function AdminClient() {
  const [session, setSession] = useState<Session | null>(null)
  const [adminStatus, setAdminStatus] = useState<AdminStatus>("checking")
  const [adminEmail, setAdminEmail] = useState("")
  const [players, setPlayers] = useState<Player[]>([])
  const [game, setGame] = useState<GameState | null>(null)
  const [message, setMessage] = useState("")
  const [isBusy, setIsBusy] = useState(false)

  const loadState = useCallback(async () => {
    const response = await fetch("/api/lobby-state")
    const data = await response.json()

    if (response.ok) {
      setPlayers(data.players)
      setGame(data.game)
    }
  }, [])

  const verifyAdmin = useCallback(async (nextSession: Session | null) => {
    if (!nextSession?.access_token) {
      setAdminStatus("signed-out")
      setAdminEmail("")
      return
    }

    setAdminStatus("verifying")
    setMessage("")

    try {
      const response = await fetch("/api/admin-login", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${nextSession.access_token}`,
        },
      })
      const data = await response.json()

      if (!response.ok) {
        setAdminStatus("denied")
        setMessage(data.error ?? "Email này không có quyền admin.")
        return
      }

      setAdminEmail(data.email)
      setAdminStatus("allowed")
      await loadState()
    } catch {
      setAdminStatus("denied")
      setMessage("Không thể kiểm tra quyền admin.")
    }
  }, [loadState])

  useEffect(() => {
    let isMounted = true

    supabaseBrowser.auth.getSession().then(({ data }) => {
      if (!isMounted) return
      setSession(data.session)
      verifyAdmin(data.session)
    })

    const { data: listener } = supabaseBrowser.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession)
        verifyAdmin(nextSession)
      }
    )

    return () => {
      isMounted = false
      listener.subscription.unsubscribe()
    }
  }, [verifyAdmin])

  useEffect(() => {
    if (adminStatus !== "allowed") return

    const timer = window.setInterval(loadState, 3000)
    return () => window.clearInterval(timer)
  }, [adminStatus, loadState])

  async function signInWithGoogle() {
    setMessage("")

    await supabaseBrowser.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/admin`,
      },
    })
  }

  async function signOut() {
    await supabaseBrowser.auth.signOut()
    setPlayers([])
    setGame(null)
    setAdminEmail("")
    setAdminStatus("signed-out")
  }

  async function postAdminAction(url: string, successMessage: string) {
    if (!session?.access_token) {
      setMessage("Bạn cần đăng nhập lại.")
      return
    }

    setIsBusy(true)
    setMessage("")

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      })
      const data = await response.json()

      if (!response.ok) {
        setMessage(data.error ?? "Thao tác thất bại.")
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

  if (adminStatus !== "allowed") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--game-bg)] px-4 text-[var(--game-white)]">
        <section className="w-full max-w-md border-4 border-[var(--game-white)] bg-[var(--game-bg-dark)] p-8 text-center shadow-[8px_8px_0px_rgba(0,0,0,0.25)]">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-[var(--game-yellow)]">
            Admin
          </p>
          <h1 className="mt-3 text-4xl font-black">Đăng nhập quản trị</h1>
          <p className="mt-3 text-sm font-bold text-white/70">
            Chỉ Gmail nằm trong ADMIN_EMAILS mới mở được trang này.
          </p>

          <Button
            type="button"
            onClick={signInWithGoogle}
            disabled={adminStatus === "checking" || adminStatus === "verifying"}
            className="mt-6 w-full"
          >
            {adminStatus === "checking" || adminStatus === "verifying"
              ? "Đang kiểm tra..."
              : "Đăng nhập bằng Google"}
          </Button>

          {session && adminStatus === "denied" && (
            <Button
              type="button"
              variant="secondary"
              onClick={signOut}
              className="mt-3 w-full"
            >
              Đăng xuất tài khoản hiện tại
            </Button>
          )}

          {message && (
            <p className="mt-4 text-sm font-bold text-red-200">{message}</p>
          )}
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[var(--game-bg)] px-4 py-10 text-[var(--game-white)]">
      <section className="mx-auto max-w-5xl bg-[var(--game-bg-dark)] p-8 shadow-[8px_8px_0px_rgba(0,0,0,0.25)]">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[var(--game-yellow)]">
              Admin
            </p>
            <h1 className="mt-3 text-4xl font-black">Điều khiển game</h1>
            <p className="mt-2 text-sm font-bold text-white/60">
              Đang đăng nhập: {adminEmail}
            </p>
          </div>

          <Button type="button" variant="secondary" onClick={signOut}>
            Đăng xuất
          </Button>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <StartGameButton
            disabled={isBusy}
            isStarted={Boolean(game?.is_started)}
            onStart={() =>
              postAdminAction("/api/start-game", "Game đã bắt đầu.")
            }
          />
          <Button
            type="button"
            variant="danger"
            disabled={isBusy}
            onClick={() => postAdminAction("/api/reset-game", "Đã reset game.")}
          >
            Reset game
          </Button>
        </div>

        {message && (
          <p className="mt-4 font-bold text-[var(--game-yellow)]">{message}</p>
        )}

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <Stat
            label="Trạng thái"
            value={game?.is_started ? "Đã bắt đầu" : "Đang chờ"}
          />
          <Stat label="Người chơi" value={String(players.length)} />
          <Stat
            label="Start time"
            value={
              game?.started_at
                ? new Date(game.started_at).toLocaleTimeString()
                : "Chưa có"
            }
          />
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-black">Leaderboard</h2>
          <AdminLeaderboard players={players} />
        </div>
      </section>
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
