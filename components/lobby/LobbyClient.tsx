"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Card from "@/components/ui/Card"
import Button from "@/components/ui/Button"
import LobbyPlayerList from "@/components/lobby/LobbyPlayerList"
import { PLAYER_ID_STORAGE_KEY } from "@/lib/constants/storage"
import { ROUTES } from "@/lib/constants/routes"
import type { GameState } from "@/lib/types/game"
import type { Player } from "@/lib/types/player"

export default function LobbyClient() {
  const router = useRouter()
  const [playerId, setPlayerId] = useState("")
  const [players, setPlayers] = useState<Player[]>([])
  const [game, setGame] = useState<GameState | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const savedPlayerId = localStorage.getItem(PLAYER_ID_STORAGE_KEY)
    if (!savedPlayerId) {
      router.push(ROUTES.home)
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
          router.push(ROUTES.game)
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
      <Card className="mx-auto max-w-3xl">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-[var(--game-yellow)]">
          Lobby
        </p>
        <h1 className="mt-3 text-4xl font-black">Đợi admin bắt đầu game</h1>
        <p className="mt-3 text-white/80">
          Tên của bạn đã được lưu trong database. Thời gian chơi chỉ bắt đầu khi admin bấm bắt đầu.
        </p>

        {error && <p className="mt-4 font-bold text-red-200">{error}</p>}

        <LobbyPlayerList players={players} />

        {game?.is_started && (
          <Button onClick={() => router.push(ROUTES.game)} className="mt-8">
            Vào game
          </Button>
        )}
      </Card>
    </main>
  )
}
