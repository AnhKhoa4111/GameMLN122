import type { Player } from "@/lib/types/player"
import { formatDurationMinutes } from "@/lib/utils"

export default function AdminLeaderboard({ players }: { players: Player[] }) {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-black">Leaderboard</h2>
      <div className="mt-4 grid gap-3">
        {players.map((player, index) => (
          <div
            key={player.id}
            className="grid gap-2 border-4 border-[var(--game-white)] bg-[var(--game-bg-light)] px-4 py-3 sm:grid-cols-[48px_1fr_90px_90px_120px] sm:items-center"
          >
            <span className="font-black">#{index + 1}</span>
            <span className="font-bold">{player.player_name}</span>
            <span className="font-black">S{player.current_stage}</span>
            <span className="font-black">{player.score} điểm</span>
            <span className="font-black text-[var(--game-yellow)]">
              {formatDurationMinutes(player.start_time, player.finish_time)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
