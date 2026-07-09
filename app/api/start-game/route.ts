import { NextRequest, NextResponse } from "next/server"
import { startGame } from "@/lib/server/gameStore"
import { verifyAdminRequest } from "@/lib/server/adminAuth"

export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAdminRequest(req)

    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const game = await startGame()
    return NextResponse.json({ game })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Không thể bắt đầu game." },
      { status: 500 }
    )
  }
}
