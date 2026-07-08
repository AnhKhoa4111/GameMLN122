import { NextRequest, NextResponse } from "next/server"
import { isValidAdminCode } from "@/lib/server/adminAuth"
import { resetGameState } from "@/lib/server/gameStore"
import { resetPlayers } from "@/lib/server/playerStore"

export async function POST(req: NextRequest) {
  try {
    const { adminCode } = await req.json()

    if (!isValidAdminCode(adminCode)) {
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
