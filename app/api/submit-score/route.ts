import { NextRequest, NextResponse } from "next/server"
import { getPlayer, updatePlayerProgress } from "@/lib/server/playerStore"
import { FINAL_STAGE } from "@/lib/types/stage"

export async function POST(req: NextRequest) {
  try {
    const { playerId, score, currentStage, finish } = await req.json()

    if (!playerId) {
      return NextResponse.json({ error: "Missing playerId" }, { status: 400 })
    }

    const player = await getPlayer(playerId)

    if (!player) {
      return NextResponse.json(
        { error: "Không tìm thấy người chơi." },
        { status: 404 }
      )
    }

    if (!player.start_time) {
      return NextResponse.json(
        { error: "Game chưa bắt đầu." },
        { status: 400 }
      )
    }

    const nextStage = Math.min(
      Number(currentStage ?? player.current_stage),
      FINAL_STAGE + 1
    )
    const totalScore = Number(score ?? player.score)
    const shouldFinish = Boolean(finish)

    const updated = await updatePlayerProgress({
      playerId,
      currentStage: nextStage,
      score: totalScore,
      finishTime: shouldFinish ? Date.now() : undefined,
    })

    return NextResponse.json({ player: updated })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Không thể lưu điểm." }, { status: 500 })
  }
}
