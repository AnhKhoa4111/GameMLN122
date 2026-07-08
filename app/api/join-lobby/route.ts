import { NextRequest, NextResponse } from "next/server"
import { createPlayer } from "@/lib/server/playerStore"

export async function POST(req: NextRequest) {
  try {
    const { playerName } = await req.json()
    const name = String(playerName ?? "").trim()

    if (name.length < 2) {
      return NextResponse.json({ error: "Tên cần ít nhất 2 ký tự" }, { status: 400 })
    }

    const player = await createPlayer(name)
    return NextResponse.json({ player })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Không thể tạo người chơi" }, { status: 500 })
  }
}
