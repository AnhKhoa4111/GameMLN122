"use client"

import { useEffect, useMemo, useState } from "react"
import { GAME_DURATION_MS } from "@/lib/constants/game"

type GameCountdownProps = {
  startTime: number
  onTimeUp?: () => void
}

export default function GameCountdown({
  startTime,
  onTimeUp,
}: GameCountdownProps) {
  const [remainingMs, setRemainingMs] = useState(GAME_DURATION_MS)

  useEffect(() => {
    function updateTimer() {
      const remaining = Math.max(startTime + GAME_DURATION_MS - Date.now(), 0)
      setRemainingMs(remaining)

      if (remaining <= 0) {
        onTimeUp?.()
      }
    }

    updateTimer()
    const timer = window.setInterval(updateTimer, 1000)

    return () => window.clearInterval(timer)
  }, [onTimeUp, startTime])

  const timerInfo = useMemo(() => {
    const totalSeconds = Math.ceil(remainingMs / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
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
      timeText: `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
        2,
        "0"
      )}`,
      progressPercent,
      barColorClass,
      textColorClass,
      statusText,
    }
  }, [remainingMs])

  return (
    <div className="mt-4">
      <div className="flex items-end justify-between gap-4">
        <div>
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

        <p className="text-right text-xs font-bold uppercase tracking-[0.18em] text-white/50">
          Countdown
        </p>
      </div>

      <div className="mt-3 h-5 w-full border-4 border-[var(--game-white)] bg-[#3f1048]">
        <div
          className={`h-full transition-all duration-500 ${timerInfo.barColorClass}`}
          style={{ width: `${timerInfo.progressPercent}%` }}
        />
      </div>
    </div>
  )
}
