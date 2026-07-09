import type { Player } from "@/lib/types/player"
import { formatDurationMinutes } from "@/lib/utils"

type AdminLeaderboardProps = {
  players: Player[]
}

export default function AdminLeaderboard({ players }: AdminLeaderboardProps) {
  if (players.length === 0) {
    return (
      <div className="mt-4 border-4 border-dashed border-white/40 bg-[var(--game-bg-light)] p-6 text-center font-bold text-white/70">
        Chưa có người chơi nào trong lobby.
      </div>
    )
  }

  return (
    <div className="mt-4 grid gap-3">
      {players.map((player, index) => (
        <div
          key={player.id}
          className="grid grid-cols-[48px_1fr_80px_90px_120px] items-center gap-3 border-4 border-[var(--game-white)] bg-[var(--game-bg-light)] px-4 py-3"
        >
          <span className="font-black">#{index + 1}</span>
          <span className="font-bold">{player.player_name}</span>
          <span className="font-black">S{player.current_stage}</span>
          <span className="font-black">{player.score}</span>
          <span className="text-sm font-bold text-white/70">
            {formatDurationMinutes(player.start_time, player.finish_time)}
          </span>
        </div>
      ))}
    </div>
  )
}
