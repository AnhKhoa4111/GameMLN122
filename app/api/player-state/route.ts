import { NextRequest, NextResponse } from "next/server"
import { getGameState } from "@/lib/server/gameStore"
import { getPlayer, setPlayerStartTime } from "@/lib/server/playerStore"

export async function GET(req: NextRequest) {
  try {
    const playerId = req.nextUrl.searchParams.get("id")

    if (!playerId) {
      return NextResponse.json({ error: "Thiếu player id." }, { status: 400 })
    }

    const [game, player] = await Promise.all([
      getGameState(),
      getPlayer(playerId),
    ])

    if (!player) {
      return NextResponse.json(
        { error: "Không tìm thấy người chơi." },
        { status: 404 }
      )
    }

    if (game.is_started && game.started_at && !player.start_time) {
      const syncedPlayer = await setPlayerStartTime({
        playerId: player.id,
        startTime: game.started_at,
      })

      return NextResponse.json({ player: syncedPlayer, game })
    }

    return NextResponse.json({ player, game })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Không thể tải người chơi." },
      { status: 500 }
    )
  }
}
