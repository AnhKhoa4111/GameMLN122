"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Button from "@/components/ui/Button"
import Card from "@/components/ui/Card"
import GameCountdown, {
  getGameCountdownInfo,
} from "@/components/game/GameCountdown"
import GameHeader from "@/components/game/GameHeader"
import GameResultModal from "@/components/game/GameResultModal"
import ScorePanel from "@/components/game/ScorePanel"
import StageProgress from "@/components/game/StageProgress"
import StageTimeline from "@/components/stages/stage-1-timeline/StageTimeline"
import StageCaseScanner from "@/components/stages/stage-2-scanner/StageCaseScanner"
import StageControllerFinder from "@/components/stages/stage-3-controller/StageControllerFinder"
import StageDecisionMaker from "@/components/stages/stage-4-decision/StageDecisionMaker"
import StageBoss from "@/components/stages/stage-5-boss/StageBoss"
import { GAME_DURATION_MS } from "@/lib/constants/game"
import { PLAYER_ID_STORAGE_KEY } from "@/lib/constants/storage"
import { ROUTES } from "@/lib/constants/routes"
import { STAGE_COMPLETION_SCORE } from "@/lib/scoring/totalScore"
import type { Player } from "@/lib/types/player"
import { FINAL_STAGE } from "@/lib/types/stage"

export default function GameClient() {
  const router = useRouter()
  const [player, setPlayer] = useState<Player | null>(null)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [remainingMs, setRemainingMs] = useState(GAME_DURATION_MS)

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

  useEffect(() => {
    if (!player?.start_time || player.finish_time) return

    function updateTimer() {
      const endTime = Number(player?.start_time) + GAME_DURATION_MS
      const remaining = Math.max(endTime - Date.now(), 0)
      setRemainingMs(remaining)
    }

    updateTimer()

    const timer = window.setInterval(updateTimer, 1000)

    return () => window.clearInterval(timer)
  }, [player?.finish_time, player?.start_time])

  const timerInfo = useMemo(
    () => getGameCountdownInfo(remainingMs, GAME_DURATION_MS),
    [remainingMs]
  )

  async function completeCurrentStage(earnedScore = STAGE_COMPLETION_SCORE) {
    if (!player) return

    if (timerInfo.isTimeUp && !player.finish_time) {
      setError("Đã hết thời gian, không thể lưu điểm mới.")
      return
    }

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
          score: player.score + earnedScore,
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

  const isPlayableStage = player.current_stage >= 1 && player.current_stage <= FINAL_STAGE
  const isWideStage = isPlayableStage
  const completionLabel =
    player.current_stage >= FINAL_STAGE ? "Hoàn thành game" : "Hoàn thành stage"

  return (
    <main className="min-h-screen bg-[var(--game-bg)] px-4 py-10 text-[var(--game-white)]">
      <Card className={`mx-auto ${isWideStage ? "max-w-6xl" : "max-w-3xl"}`}>
        <GameHeader player={player} />
        <StageProgress currentStage={player.current_stage} />
        <GameCountdown timerInfo={timerInfo} />
        <ScorePanel player={player} />

        {error && <p className="mt-4 font-bold text-red-200">{error}</p>}

        {timerInfo.isTimeUp && !player.finish_time && (
          <div className="mt-6 border-4 border-red-300 bg-red-600/40 p-4 text-center">
            <p className="text-xl font-black text-red-100">
              Hết giờ! Vui lòng chờ admin xem bảng điểm.
            </p>
          </div>
        )}

        {player.finish_time ? (
          <div className="mt-8 border-4 border-[var(--game-white)] bg-[var(--game-bg-light)] p-5 text-center">
            <p className="text-2xl font-black text-[var(--game-yellow)]">Bạn đã hoàn thành game</p>
            <p className="mt-2 font-bold text-white/80">
              Kết quả đã được lưu. Bạn có thể xem lại điểm và thời gian ở bảng xếp hạng.
            </p>
          </div>
        ) : timerInfo.isTimeUp ? null : player.current_stage === 1 ? (
          <StageTimeline onCompleted={completeCurrentStage} isSubmitting={isSubmitting} />
        ) : player.current_stage === 2 ? (
          <StageCaseScanner onCompleted={completeCurrentStage} isSubmitting={isSubmitting} />
        ) : player.current_stage === 3 ? (
          <StageControllerFinder onCompleted={completeCurrentStage} isSubmitting={isSubmitting} />
        ) : player.current_stage === 4 ? (
          <StageDecisionMaker onCompleted={completeCurrentStage} isSubmitting={isSubmitting} />
        ) : player.current_stage === FINAL_STAGE ? (
          <StageBoss onCompleted={completeCurrentStage} isSubmitting={isSubmitting} />
        ) : (
          <Button
            onClick={() => completeCurrentStage()}
            disabled={isSubmitting || Boolean(player.finish_time)}
            className="mt-8"
          >
            {player.finish_time ? "Đã hoàn thành" : isSubmitting ? "Đang lưu..." : completionLabel}
          </Button>
        )}
      </Card>

      {showResult && player.finish_time && (
        <GameResultModal player={player} onClose={() => setShowResult(false)} />
      )}
    </main>
  )
}
