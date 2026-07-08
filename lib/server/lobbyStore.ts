import { getGameState } from "@/lib/server/gameStore"
import { getPlayers } from "@/lib/server/playerStore"

export async function getLobbyState() {
  const [game, players] = await Promise.all([getGameState(), getPlayers()])
  return { game, players }
}
