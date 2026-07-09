"use client"

import { GAME_DURATION_MINUTES } from "@/lib/constants/game"

export type GameCountdownInfo = {
  timeText: string
  progressPercent: number
  barColorClass: string
  textColorClass: string
  statusText: string
  isTimeUp: boolean
}

type GameCountdownProps = {
  timerInfo: GameCountdownInfo
}

export default function GameCountdown({ timerInfo }: GameCountdownProps) {
  return (
    <section className="mt-5 border-4 border-[var(--game-white)] bg-[var(--game-bg-dark)] p-4 shadow-[6px_6px_0px_rgba(0,0,0,0.22)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--game-yellow)]">
            Thoi gian con lai
          </p>
          <p className={`mt-1 text-4xl font-black leading-none ${timerInfo.textColorClass}`}>
            {timerInfo.timeText}
          </p>
        </div>

        <div className="text-left md:text-right">
          <p className="text-lg font-black">{timerInfo.statusText}</p>
          <p className="mt-1 text-sm font-bold text-white/75">
            Tong thoi gian: {GAME_DURATION_MINUTES} phut
          </p>
        </div>
      </div>

      <div className="mt-4 h-6 w-full border-4 border-[var(--game-white)] bg-[#3f1048]">
        <div
          className={`h-full transition-all duration-500 ${timerInfo.barColorClass}`}
          style={{ width: `${timerInfo.progressPercent}%` }}
        />
      </div>
    </section>
  )
}

export function getGameCountdownInfo(
  remainingMs: number,
  gameDurationMs: number
): GameCountdownInfo {
  const totalSeconds = Math.ceil(remainingMs / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const remainingMinutes = remainingMs / 1000 / 60
  const progressPercent = Math.max(
    Math.min((remainingMs / gameDurationMs) * 100, 100),
    0
  )

  let barColorClass = "bg-green-400"
  let textColorClass = "text-green-300"
  let statusText = "Thoi gian con nhieu"

  if (remainingMinutes <= 15 && remainingMinutes > 10) {
    barColorClass = "bg-[var(--game-yellow)]"
    textColorClass = "text-[var(--game-yellow)]"
    statusText = "Hay tang toc"
  }

  if (remainingMinutes <= 10 && remainingMinutes > 5) {
    barColorClass = "bg-red-500"
    textColorClass = "text-red-300"
    statusText = "Nguy hiem"
  }

  if (remainingMinutes <= 5) {
    barColorClass = "bg-red-600 animate-pulse"
    textColorClass = "text-red-300 animate-pulse"
    statusText = "Sap het thoi gian!"
  }

  if (remainingMs <= 0) {
    barColorClass = "bg-red-700"
    textColorClass = "text-red-300"
    statusText = "Da het thoi gian"
  }

  return {
    timeText: `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
    progressPercent,
    barColorClass,
    textColorClass,
    statusText,
    isTimeUp: remainingMs <= 0,
  }
}
