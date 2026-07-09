"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import type { Player } from "@/lib/types/player"
import { FINAL_STAGE } from "@/lib/types/stage"
import StageTimeline from "@/components/stages/stage-1-timeline/StageTimeline"
import StageCaseScanner from "@/components/stages/stage-2-scanner/StageCaseScanner"
import StageControllerFinder from "@/components/stages/stage-3-controller/StageControllerFinder"
import StageDecisionMaker from "@/components/stages/stage-4-decision/StageDecisionMaker"
import StageBoss from "@/components/stages/stage-5-boss/StageBoss"

const PLAYER_ID_KEY = "mln122-player-id"
const GAME_DURATION_MS = 20 * 60 * 1000

export default function GamePage() {
  const router = useRouter()
  const [player, setPlayer] = useState<Player | null>(null)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [remainingMs, setRemainingMs] = useState(GAME_DURATION_MS)

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

  useEffect(() => {
    if (!player?.start_time) return

    function updateTimer() {
      const endTime = Number(player?.start_time) + GAME_DURATION_MS
      const remaining = Math.max(endTime - Date.now(), 0)
      setRemainingMs(remaining)
    }

    updateTimer()

    const timer = window.setInterval(updateTimer, 1000)

    return () => window.clearInterval(timer)
  }, [player?.start_time])

  const timerInfo = useMemo(() => {
    const totalSeconds = Math.ceil(remainingMs / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60

    const timeText = `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`

    const remainingMinutes = remainingMs / 1000 / 60
    const progressPercent = Math.max(
      Math.min((remainingMs / GAME_DURATION_MS) * 100, 100),
      0
    )

    let barColorClass = "bg-green-400"
    let textColorClass = "text-green-300"
    let statusText = "Thời gian còn nhiều"

    if (remainingMinutes <= 15 && remainingMinutes > 10) {
      barColorClass = "bg-[var(--game-yellow)]"
      textColorClass = "text-[var(--game-yellow)]"
      statusText = "Hãy tăng tốc"
    }

    if (remainingMinutes <= 10 && remainingMinutes > 5) {
      barColorClass = "bg-red-500"
      textColorClass = "text-red-300"
      statusText = "Nguy hiểm"
    }

    if (remainingMinutes <= 5) {
      barColorClass = "bg-red-600 animate-pulse"
      textColorClass = "text-red-300 animate-pulse"
      statusText = "Sắp hết thời gian!"
    }

    if (remainingMs <= 0) {
      barColorClass = "bg-red-700"
      textColorClass = "text-red-300"
      statusText = "Đã hết thời gian"
    }

    return {
      timeText,
      progressPercent,
      barColorClass,
      textColorClass,
      statusText,
      isTimeUp: remainingMs <= 0,
    }
  }, [remainingMs])

  const isGameCompleted = Boolean(
    player?.finish_time && player.current_stage > FINAL_STAGE
  )

  async function submitStageScore(stageScore: number) {
    const alreadyCompleted = Boolean(
      player?.finish_time && player.current_stage > FINAL_STAGE
    )

    if (!player || isSubmitting || alreadyCompleted) return
    
    if (timerInfo.isTimeUp) {
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
        router.push("/game/complete")
      }
    } catch {
      setError("Không thể kết nối database.")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function completeTestStage() {
    if (!player) return
    await submitStageScore(100)
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
      <div className="border-b-4 border-[var(--game-white)] bg-[var(--game-bg-dark)] px-4 py-4">
        <div className="mx-auto flex max-w-6xl flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-white/70">Người chơi</p>
              <p className="text-xl font-black text-[var(--game-yellow)]">
                {player.player_name}
              </p>
            </div>

            <div className="text-center">
              <p className="text-sm font-bold text-white/70">Thời gian còn lại</p>
              <p
                className={`text-4xl font-black leading-none ${timerInfo.textColorClass}`}
              >
                {timerInfo.timeText}
              </p>
              <p className="mt-1 text-xs font-black uppercase tracking-[0.2em] text-white/70">
                {timerInfo.statusText}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm font-bold text-white/70">Tổng điểm</p>
              <p className="text-2xl font-black">{player.score}</p>
            </div>
          </div>

          <div className="h-6 w-full border-4 border-[var(--game-white)] bg-[#3f1048]">
            <div
              className={`h-full transition-all duration-500 ${timerInfo.barColorClass}`}
              style={{
                width: `${timerInfo.progressPercent}%`,
              }}
            />
          </div>
        </div>
      </div>

      {error && (
        <p className="mx-auto mt-4 max-w-6xl px-4 font-bold text-red-200">
          {error}
        </p>
      )}

      {timerInfo.isTimeUp && !player.finish_time && (
        <div className="mx-auto mt-6 max-w-6xl px-4">
          <div className="border-4 border-red-300 bg-red-600/40 p-4 text-center">
            <p className="text-xl font-black text-red-100">
              Hết giờ! Vui lòng chờ admin xem bảng điểm.
            </p>
          </div>
        </div>
      )}

      {player.current_stage === 1 && !timerInfo.isTimeUp && !isGameCompleted && (
        <StageTimeline
          onCompleted={submitStageScore}
          isSubmitting={isSubmitting}
        />
      )}

      {player.current_stage === 2 && !timerInfo.isTimeUp && !isGameCompleted && (
        <StageCaseScanner
          onCompleted={submitStageScore}
          isSubmitting={isSubmitting}
        />
      )}

      {player.current_stage === 3 && !timerInfo.isTimeUp && !isGameCompleted && (
        <StageControllerFinder
          onCompleted={submitStageScore}
          isSubmitting={isSubmitting}
        />
      )}

      {player.current_stage === 4 && !timerInfo.isTimeUp && !isGameCompleted && (
        <StageDecisionMaker
          onCompleted={submitStageScore}
          isSubmitting={isSubmitting}
        />
      )}

      {player.current_stage === 5 && !timerInfo.isTimeUp && !isGameCompleted && (
        <StageBoss
          onCompleted={submitStageScore}
          isSubmitting={isSubmitting}
        />
      )}



      {player.finish_time && player.current_stage > FINAL_STAGE && (
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

            <p className="mt-4 text-lg font-black text-white">
              Việt Nam đã được bảo vệ 🇻🇳
            </p>
          </div>
        </section>
      )}
    </main>
  )
}