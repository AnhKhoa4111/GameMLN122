import { NextRequest, NextResponse } from "next/server"
import { getGameState } from "@/lib/server/gameStore"
import { getPlayer, setPlayerStartTime } from "@/lib/server/playerStore"

export async function GET(req: NextRequest) {
  try {
    const playerId = req.nextUrl.searchParams.get("id")

    if (!playerId) {
      return NextResponse.json({ error: "Thiếu playerId" }, { status: 400 })
    }

    let player = await getPlayer(playerId)
    if (!player) {
      return NextResponse.json({ error: "Không tìm thấy người chơi" }, { status: 404 })
    }

    const game = await getGameState()
    if (game.is_started && game.started_at && !player.start_time) {
      player = await setPlayerStartTime(player.id, game.started_at)
    }

    return NextResponse.json({ player, game })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Không thể tải người chơi" }, { status: 500 })
  }
}
