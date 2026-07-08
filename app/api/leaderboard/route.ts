import { NextResponse } from "next/server"
import { getPlayers } from "@/lib/server/playerStore"

export async function GET() {
  try {
    const players = await getPlayers()
    return NextResponse.json({ players })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Không thể tải bảng điểm" }, { status: 500 })
  }
}
