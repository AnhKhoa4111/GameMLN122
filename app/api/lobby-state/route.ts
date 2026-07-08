import { NextResponse } from "next/server"
import { getLobbyState } from "@/lib/server/lobbyStore"

export async function GET() {
  try {
    const state = await getLobbyState()
    return NextResponse.json(state)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Không thể tải lobby" }, { status: 500 })
  }
}
