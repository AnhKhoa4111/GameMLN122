"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { Player } from "@/lib/types/player"
import { FINAL_STAGE } from "@/lib/types/stage"

const PLAYER_ID_KEY = "mln122-player-id"

export default function GamePage() {
  const router = useRouter()
  const [player, setPlayer] = useState<Player | null>(null)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const playerId = localStorage.getItem(PLAYER_ID_KEY)
    if (!playerId) {
      router.push("/")
      return
    }

    async function loadPlayer() {
      const response = await fetch("/api/lobby-state")
      const data = await response.json()
      const found = data.players?.find((item: Player) => item.id === playerId)

      if (!found) {
        router.push("/")
        return
      }

      if (!found.start_time) {
        router.push("/lobby")
        return
      }

      setPlayer(found)
    }

    loadPlayer().catch(() => setError("Không thể tải game."))
  }, [router])

  async function completeCurrentStage() {
    if (!player) return
    setIsSubmitting(true)
    setError("")

    const nextStage = Math.min(player.current_stage + 1, FINAL_STAGE)
    const finish = player.current_stage >= FINAL_STAGE

    try {
      const response = await fetch("/api/submit-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerId: player.id,
          currentStage: nextStage,
          score: player.score + 100,
          finish,
        }),
      })
      const data = await response.json()

      if (!response.ok) {
        setError(data.error ?? "Không thể lưu tiến độ.")
        return
      }

      setPlayer(data.player)
    } catch {
      setError("Không thể kết nối database.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!player) {
    return <main className="min-h-screen bg-[var(--game-bg)] p-8">Đang tải...</main>
  }

  return (
    <main className="min-h-screen bg-[var(--game-bg)] px-4 py-10 text-[var(--game-white)]">
      <section className="mx-auto max-w-3xl bg-[var(--game-bg-dark)] p-8 shadow-[8px_8px_0px_rgba(0,0,0,0.25)]">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-[var(--game-yellow)]">
          Người chơi: {player.player_name}
        </p>
        <h1 className="mt-3 text-4xl font-black">Stage {player.current_stage}</h1>
        <p className="mt-3 text-white/80">
          Start time được lấy từ lúc admin bấm bắt đầu. Finish time chỉ lưu khi người chơi bấm hoàn thành stage cuối.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Stat label="Điểm" value={String(player.score)} />
          <Stat label="Start time" value={player.start_time ? new Date(player.start_time).toLocaleTimeString() : "Chưa có"} />
          <Stat label="Finish time" value={player.finish_time ? new Date(player.finish_time).toLocaleTimeString() : "Chưa xong"} />
        </div>

        {error && <p className="mt-4 font-bold text-red-200">{error}</p>}

        <button
          onClick={completeCurrentStage}
          disabled={isSubmitting || Boolean(player.finish_time)}
          className="mt-8 border-4 border-[var(--game-white)] bg-[var(--game-yellow)] px-6 py-3 font-black text-[var(--game-bg-dark)] disabled:opacity-60"
        >
          {player.finish_time ? "Đã hoàn thành" : isSubmitting ? "Đang lưu..." : "Hoàn thành stage"}
        </button>
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
