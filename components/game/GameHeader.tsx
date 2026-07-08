import type { Player } from "@/lib/types/player"

export default function GameHeader({ player }: { player: Player }) {
  return (
    <>
      <p className="text-sm font-black uppercase tracking-[0.24em] text-[var(--game-yellow)]">
        Người chơi: {player.player_name}
      </p>
      <h1 className="mt-3 text-4xl font-black">Stage {player.current_stage}</h1>
      <p className="mt-3 text-white/80">
        Start time được lấy từ lúc admin bấm bắt đầu. Finish time chỉ lưu khi người chơi hoàn thành stage cuối.
      </p>
    </>
  )
}
