import { NextRequest, NextResponse } from "next/server"
import { resetGameState } from "@/lib/server/gameStore"
import { resetPlayers } from "@/lib/server/playerStore"

export async function POST(req: NextRequest) {
  try {
    const { adminCode } = await req.json()
    const expectedCode = process.env.ADMIN_CODE ?? process.env.HOST_CODE ?? "admin"

    if (String(adminCode ?? "") !== expectedCode) {
      return NextResponse.json({ error: "Mã admin không đúng" }, { status: 403 })
    }

    await resetPlayers()
    await resetGameState()
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Không thể reset game" }, { status: 500 })
  }
}
