import type { Player } from "@/lib/types/player"
import { formatClockTime, formatDurationMinutes } from "@/lib/utils"

export default function ScorePanel({ player }: { player: Player }) {
  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-4">
      <Stat label="Điểm" value={String(player.score)} />
      <Stat label="Start time" value={formatClockTime(player.start_time)} />
      <Stat
        label="Finish time"
        value={player.finish_time ? formatClockTime(player.finish_time) : "Chưa xong"}
      />
      <Stat label="Thời gian" value={formatDurationMinutes(player.start_time, player.finish_time)} />
    </div>
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
