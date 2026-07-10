import { NextRequest, NextResponse } from "next/server"
import { getGameState } from "@/lib/server/gameStore"
import { createPlayer, deletePlayer } from "@/lib/server/playerStore"

const GAME_ALREADY_STARTED_MESSAGE =
  "Game đã bắt đầu. Chỉ người chơi đã vào phòng trước đó mới có thể vào lại."

export async function POST(req: NextRequest) {
  try {
    const { playerName } = await req.json()
    const name = String(playerName ?? "").trim()

    if (name.length < 2) {
      return NextResponse.json({ error: "Tên cần ít nhất 2 ký tự" }, { status: 400 })
    }

    const game = await getGameState()

    if (game.is_started) {
      return NextResponse.json(
        { error: GAME_ALREADY_STARTED_MESSAGE },
        { status: 403 }
      )
    }

    const player = await createPlayer(name)
    const latestGame = await getGameState()

    if (latestGame.is_started) {
      await deletePlayer(player.id)
      return NextResponse.json(
        { error: GAME_ALREADY_STARTED_MESSAGE },
        { status: 403 }
      )
    }

    return NextResponse.json({ player })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Không thể tạo người chơi" }, { status: 500 })
  }
}
