import type { Player } from "@/lib/types/player"

type LobbyPlayerListProps = {
  players: Player[]
}

export default function LobbyPlayerList({ players }: LobbyPlayerListProps) {
  if (players.length === 0) {
    return (
      <div className="mt-4 border-4 border-dashed border-white/40 bg-[var(--game-bg-light)] px-4 py-6 text-center font-bold text-white/70">
        Chưa có người chơi nào.
      </div>
    )
  }

  return (
    <div className="mt-4 grid gap-3">
      {players.map((player) => (
        <div
          key={player.id}
          className="flex items-center justify-between border-4 border-[var(--game-white)] bg-[var(--game-bg-light)] px-4 py-3"
        >
          <span className="font-bold">{player.player_name}</span>
          <span className="text-sm font-black text-[var(--game-yellow)]">
            Stage {player.current_stage}
          </span>
        </div>
      ))}
    </div>
  )
}
