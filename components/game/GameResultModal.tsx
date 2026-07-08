import Modal from "@/components/ui/Modal"
import type { Player } from "@/lib/types/player"
import { formatDurationMinutes } from "@/lib/utils"

export default function GameResultModal({
  player,
  onClose,
}: {
  player: Player
  onClose: () => void
}) {
  if (!player.finish_time) return null

  return (
    <Modal title="Bạn đã hoàn thành game" onClose={onClose}>
      <p className="text-white/80">
        Chúc mừng {player.player_name}. Tổng điểm hiện tại của bạn là{" "}
        <span className="font-black text-[var(--game-yellow)]">{player.score}</span>.
      </p>
      <p className="mt-3 font-bold text-white/80">
        Thời gian hoàn thành:{" "}
        <span className="text-[var(--game-yellow)]">
          {formatDurationMinutes(player.start_time, player.finish_time)}
        </span>
      </p>
    </Modal>
  )
}
