import { NextRequest, NextResponse } from "next/server"
import { verifyAdminRequest } from "@/lib/server/adminAuth"
import { startGame } from "@/lib/server/gameStore"

export async function POST(req: NextRequest) {
  try {
    const admin = await verifyAdminRequest(req)

    if (!admin.ok) {
      return NextResponse.json({ error: admin.error }, { status: 403 })
    }

    const game = await startGame()
    return NextResponse.json({ game })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Không thể bắt đầu game" }, { status: 500 })
  }
}
