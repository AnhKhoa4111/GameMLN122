"use client"

import { useEffect, useState } from "react"
import type { GameState } from "@/lib/types/game"
import type { Player } from "@/lib/types/player"

export default function AdminPage() {
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
      <section className="mx-auto max-w-4xl bg-[var(--game-bg-dark)] p-8 shadow-[8px_8px_0px_rgba(0,0,0,0.25)]">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-[var(--game-yellow)]">
          Admin
        </p>
        <h1 className="mt-3 text-4xl font-black">Điều khiển game</h1>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            value={adminCode}
            onChange={(event) => setAdminCode(event.target.value)}
            placeholder="Nhập mã admin"
            className="flex-1 border-4 border-[var(--game-white)] bg-[var(--game-bg-light)] px-4 py-3 font-bold outline-none"
          />
          <button
            disabled={isBusy}
            onClick={() => postAdminAction("/api/start-game", "Game đã bắt đầu.")}
            className="border-4 border-[var(--game-white)] bg-[var(--game-yellow)] px-5 py-3 font-black text-[var(--game-bg-dark)] disabled:opacity-60"
          >
            Bắt đầu game
          </button>
          <button
            disabled={isBusy}
            onClick={() => postAdminAction("/api/reset-game", "Đã reset game.")}
            className="border-4 border-[var(--game-white)] bg-red-500 px-5 py-3 font-black text-white disabled:opacity-60"
          >
            Reset
          </button>
        </div>

        {message && <p className="mt-4 font-bold text-[var(--game-yellow)]">{message}</p>}

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <Stat label="Trạng thái" value={game?.is_started ? "Đã bắt đầu" : "Đang chờ"} />
          <Stat label="Người chơi" value={String(players.length)} />
          <Stat label="Start time" value={game?.started_at ? new Date(game.started_at).toLocaleTimeString() : "Chưa có"} />
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-black">Leaderboard</h2>
          <div className="mt-4 grid gap-3">
            {players.map((player, index) => (
              <div
                key={player.id}
                className="grid grid-cols-[48px_1fr_90px_90px] items-center gap-3 border-4 border-[var(--game-white)] bg-[var(--game-bg-light)] px-4 py-3"
              >
                <span className="font-black">#{index + 1}</span>
                <span className="font-bold">{player.player_name}</span>
                <span className="font-black">S{player.current_stage}</span>
                <span className="font-black">{player.score}</span>
              </div>
            ))}
          </div>
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
