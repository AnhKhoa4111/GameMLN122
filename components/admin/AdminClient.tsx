"use client"

import { useEffect, useState } from "react"
import AdminLeaderboard from "@/components/admin/AdminLeaderboard"
import StartGameButton from "@/components/admin/StartGameButton"
import Button from "@/components/ui/Button"
import Card from "@/components/ui/Card"
import { formatClockTime } from "@/lib/utils"
import type { GameState } from "@/lib/types/game"
import type { Player } from "@/lib/types/player"

export default function AdminClient() {
  const [adminCode, setAdminCode] = useState("")
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

  useEffect(() => {
    loadState()
    const timer = window.setInterval(loadState, 3000)
    return () => window.clearInterval(timer)
  }, [])

  async function postAdminAction(url: string, successMessage: string) {
    setIsBusy(true)
    setMessage("")

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminCode }),
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

  return (
    <main className="min-h-screen bg-[var(--game-bg)] px-4 py-10 text-[var(--game-white)]">
      <Card className="mx-auto max-w-4xl">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-[var(--game-yellow)]">
          Admin
        </p>
        <h1 className="mt-3 text-4xl font-black">Điều khiển game</h1>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            value={adminCode}
            onChange={(event) => setAdminCode(event.target.value)}
            placeholder="Nhập mã admin"
            className="flex-1 border-4 border-[var(--game-white)] bg-[var(--game-bg-light)] placeholder:text-white px-4 py-3 font-bold outline-none"
          />
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
