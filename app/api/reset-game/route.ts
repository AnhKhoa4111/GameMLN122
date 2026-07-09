import { NextRequest, NextResponse } from "next/server"
import { resetGameState } from "@/lib/server/gameStore"
import { resetPlayers } from "@/lib/server/playerStore"
import { verifyAdminRequest } from "@/lib/server/adminAuth"

export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAdminRequest(req)

    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    await resetPlayers()
    await resetGameState()
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Không thể reset game." },
      { status: 500 }
    )
  }
}
