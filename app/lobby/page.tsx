"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { GameState } from "@/lib/types/game"
import type { Player } from "@/lib/types/player"

const PLAYER_ID_KEY = "mln122-player-id"

export default function LobbyPage() {
  const router = useRouter()
  const [playerId, setPlayerId] = useState("")
  const [players, setPlayers] = useState<Player[]>([])
  const [game, setGame] = useState<GameState | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const savedPlayerId = localStorage.getItem(PLAYER_ID_KEY)
    if (!savedPlayerId) {
      router.push("/")
      return
    }

    setPlayerId(savedPlayerId)
  }, [router])

  useEffect(() => {
    if (!playerId) return

    async function loadLobby() {
      try {
        const response = await fetch("/api/lobby-state")
        const data = await response.json()

        if (!response.ok) {
          setError(data.error ?? "Không thể tải lobby.")
          return
        }

        setPlayers(data.players)
        setGame(data.game)

        if (data.game?.is_started) {
          router.push("/game")
        }
      } catch {
        setError("Không thể kết nối database.")
      }
    }

    loadLobby()
    const timer = window.setInterval(loadLobby, 2500)
    return () => window.clearInterval(timer)
  }, [playerId, router])

  return (
    <main className="min-h-screen bg-[var(--game-bg)] px-4 py-10 text-[var(--game-white)]">
      <section className="mx-auto max-w-3xl bg-[var(--game-bg-dark)] p-8 shadow-[8px_8px_0px_rgba(0,0,0,0.25)]">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-[var(--game-yellow)]">
          Lobby
        </p>
        <h1 className="mt-3 text-4xl font-black">Đợi admin bắt đầu game</h1>
        <p className="mt-3 text-white/80">
          Tên của bạn đã được lưu trong database. Thời gian chơi chỉ bắt đầu khi admin bấm bắt đầu.
        </p>

        {error && <p className="mt-4 font-bold text-red-200">{error}</p>}

        <div className="mt-8">
          <h2 className="text-xl font-black">Người chơi trong lobby ({players.length})</h2>
          <div className="mt-4 grid gap-3">
            {players.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between border-4 border-[var(--game-white)] bg-[var(--game-bg-light)] px-4 py-3"
              >
                <span className="font-bold">{player.player_name}</span>
                <span className="text-sm font-black text-[var(--game-yellow)]">
                  Stage {player.current_stage}
                </span>
              </div>
            ))}
          </div>
        </div>

        {game?.is_started && (
          <button
            onClick={() => router.push("/game")}
            className="mt-8 border-4 border-[var(--game-white)] bg-[var(--game-yellow)] px-6 py-3 font-black text-[var(--game-bg-dark)]"
          >
            Vào game
          </button>
        )}
      </section>
    </main>
  )
}
