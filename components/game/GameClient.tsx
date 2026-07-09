"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import GameCountdown from "@/components/game/GameCountdown"
import StageTimeline from "@/components/stages/stage-1-timeline/StageTimeline"
import StageCaseScanner from "@/components/stages/stage-2-scanner/StageCaseScanner"
import StageControllerFinder from "@/components/stages/stage-3-controller/StageControllerFinder"
import StageDecisionMaker from "@/components/stages/stage-4-decision/StageDecisionMaker"
import StageBoss from "@/components/stages/stage-5-boss/StageBoss"
import { APP_ROUTES } from "@/lib/constants/routes"
import { GAME_DURATION_MS } from "@/lib/constants/game"
import { PLAYER_ID_KEY } from "@/lib/constants/storage"
import type { Player } from "@/lib/types/player"
import { FINAL_STAGE } from "@/lib/types/stage"

function isPlayerTimeUp(player: Player) {
  if (!player.start_time) return false
  return Date.now() >= Number(player.start_time) + GAME_DURATION_MS
}

export default function GameClient() {
  const router = useRouter()
  const [player, setPlayer] = useState<Player | null>(null)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isTimeUp, setIsTimeUp] = useState(false)

  const isGameCompleted = Boolean(
    player?.finish_time && player.current_stage > FINAL_STAGE
  )

  useEffect(() => {
    const playerId = localStorage.getItem(PLAYER_ID_KEY)

    if (!playerId) {
      router.push(APP_ROUTES.home)
      return
    }

    async function loadPlayer() {
      const response = await fetch(`/api/player-state?id=${playerId}`)
      const data = await response.json()

      if (!response.ok || !data.player) {
        localStorage.removeItem(PLAYER_ID_KEY)
        router.push(APP_ROUTES.home)
        return
      }

      if (!data.player.start_time) {
        router.push(APP_ROUTES.lobby)
        return
      }

      setPlayer(data.player)
      setIsTimeUp(isPlayerTimeUp(data.player))
    }

    loadPlayer().catch(() => setError("Không thể tải game."))
  }, [router])

  const handleTimeUp = useCallback(() => {
    setIsTimeUp(true)
  }, [])

  async function submitStageScore(stageScore: number) {
    if (!player || isSubmitting || isGameCompleted) return

    if (isTimeUp || isPlayerTimeUp(player)) {
      setIsTimeUp(true)
      setError("Đã hết thời gian, không thể lưu điểm mới.")
      return
    }

    setIsSubmitting(true)
    setError("")

    const currentStage = player.current_stage
    const finish = currentStage === FINAL_STAGE
    const nextStage = finish ? FINAL_STAGE + 1 : currentStage + 1
    const newTotalScore = player.score + stageScore

    try {
      const response = await fetch("/api/submit-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerId: player.id,
          currentStage: nextStage,
          score: newTotalScore,
          finish,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error ?? "Không thể lưu điểm.")
        return
      }

      setPlayer(data.player)

      if (finish) {
        router.push(APP_ROUTES.gameComplete)
      }
    } catch {
      setError("Không thể kết nối database.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!player) {
    return (
      <main className="min-h-screen bg-[var(--game-bg)] p-8 text-white">
        Đang tải...
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[var(--game-bg)] text-[var(--game-white)]">
      <header className="border-b-4 border-[var(--game-white)] bg-[var(--game-bg-dark)] px-4 py-4">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-white/70">Người chơi</p>
              <p className="text-xl font-black text-[var(--game-yellow)]">
                {player.player_name}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm font-bold text-white/70">Tổng điểm</p>
              <p className="text-2xl font-black">{player.score}</p>
              <p className="mt-1 text-xs font-black uppercase tracking-[0.18em] text-white/50">
                Stage {Math.min(player.current_stage, FINAL_STAGE)}
              </p>
            </div>
          </div>

          {!isGameCompleted && player.start_time && (
            <GameCountdown startTime={player.start_time} onTimeUp={handleTimeUp} />
          )}
        </div>
      </header>

      {error && (
        <p className="mx-auto mt-4 max-w-6xl px-4 font-bold text-red-200">
          {error}
        </p>
      )}

      {isTimeUp && !player.finish_time && (
        <div className="mx-auto mt-6 max-w-6xl px-4">
          <div className="border-4 border-red-300 bg-red-600/40 p-4 text-center">
            <p className="text-xl font-black text-red-100">
              Hết giờ! Vui lòng chờ admin xem bảng điểm.
            </p>
          </div>
        </div>
      )}

      {player.current_stage === 1 && !isTimeUp && !isGameCompleted && (
        <StageTimeline
          onCompleted={submitStageScore}
          isSubmitting={isSubmitting}
        />
      )}

      {player.current_stage === 2 && !isTimeUp && !isGameCompleted && (
        <StageCaseScanner
          onCompleted={submitStageScore}
          isSubmitting={isSubmitting}
        />
      )}

      {player.current_stage === 3 && !isTimeUp && !isGameCompleted && (
        <StageControllerFinder
          onCompleted={submitStageScore}
          isSubmitting={isSubmitting}
        />
      )}

      {player.current_stage === 4 && !isTimeUp && !isGameCompleted && (
        <StageDecisionMaker
          onCompleted={submitStageScore}
          isSubmitting={isSubmitting}
        />
      )}

      {player.current_stage === 5 && !isTimeUp && !isGameCompleted && (
        <StageBoss
          onCompleted={submitStageScore}
          isSubmitting={isSubmitting}
        />
      )}

      {isGameCompleted && (
        <section className="mx-auto max-w-3xl px-4 py-10">
          <div className="case-enter rounded-[28px] border-4 border-[var(--game-white)] bg-[linear-gradient(135deg,#3f1048,#1b102b)] p-8 text-center shadow-[10px_10px_0px_rgba(0,0,0,0.35)]">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-4 border-[var(--game-white)] bg-[var(--game-yellow)] text-6xl shadow-[5px_5px_0px_rgba(0,0,0,0.35)]">
              🏆
            </div>

            <p className="mt-5 text-sm font-black uppercase tracking-[0.24em] text-[var(--game-yellow)]">
              Mission Complete
            </p>

            <h1 className="mt-3 text-4xl font-black uppercase text-[var(--game-yellow)]">
              Hoàn thành game!
            </h1>

            <p className="mt-4 text-xl font-bold text-white/80">
              Tổng điểm của bạn
            </p>

            <p className="mt-2 text-7xl font-black text-[var(--game-yellow)]">
              {player.score}
            </p>
          </div>
        </section>
      )}
    </main>
  )
}
