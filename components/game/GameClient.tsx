"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Button from "@/components/ui/Button"
import Card from "@/components/ui/Card"
import GameHeader from "@/components/game/GameHeader"
import GameResultModal from "@/components/game/GameResultModal"
import ScorePanel from "@/components/game/ScorePanel"
import StageProgress from "@/components/game/StageProgress"
import { PLAYER_ID_STORAGE_KEY } from "@/lib/constants/storage"
import { ROUTES } from "@/lib/constants/routes"
import { addStageCompletionScore } from "@/lib/scoring/totalScore"
import type { Player } from "@/lib/types/player"
import { FINAL_STAGE } from "@/lib/types/stage"

export default function GameClient() {
  const router = useRouter()
  const [player, setPlayer] = useState<Player | null>(null)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    const playerId = localStorage.getItem(PLAYER_ID_STORAGE_KEY)
    if (!playerId) {
      router.push(ROUTES.home)
      return
    }

    async function loadPlayer() {
      const response = await fetch(`/api/player-state?id=${playerId}`)
      const data = await response.json()

      if (!response.ok) {
        router.push(ROUTES.home)
        return
      }

      if (!data.player.start_time) {
        router.push(ROUTES.lobby)
        return
      }

      setPlayer(data.player)
      setShowResult(Boolean(data.player.finish_time))
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
          score: addStageCompletionScore(player.score),
          finish,
        }),
      })
      const data = await response.json()

      if (!response.ok) {
        setError(data.error ?? "Không thể lưu tiến độ.")
        return
      }

      setPlayer(data.player)
      setShowResult(Boolean(data.player.finish_time))
    } catch {
      setError("Không thể kết nối database.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!player) {
    return <main className="min-h-screen bg-[var(--game-bg)] p-8">Đang tải...</main>
  }

  const completionLabel =
    player.current_stage >= FINAL_STAGE ? "Hoàn thành game" : "Hoàn thành stage"

  return (
    <main className="min-h-screen bg-[var(--game-bg)] px-4 py-10 text-[var(--game-white)]">
      <Card className="mx-auto max-w-3xl">
        <GameHeader player={player} />
        <StageProgress currentStage={player.current_stage} />
        <ScorePanel player={player} />

        {error && <p className="mt-4 font-bold text-red-200">{error}</p>}

        <Button
          onClick={completeCurrentStage}
          disabled={isSubmitting || Boolean(player.finish_time)}
          className="mt-8"
        >
          {player.finish_time ? "Đã hoàn thành" : isSubmitting ? "Đang lưu..." : completionLabel}
        </Button>
      </Card>

      {showResult && player.finish_time && (
        <GameResultModal player={player} onClose={() => setShowResult(false)} />
      )}
    </main>
  )
}
