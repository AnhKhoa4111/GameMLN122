import type { Player } from "@/lib/types/player"

export default function LobbyPlayerList({ players }: { players: Player[] }) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-black">Người chơi trong lobby ({players.length})</h2>
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
    </div>
  )
}
