import { NextRequest, NextResponse } from "next/server"
import { isValidAdminCode } from "@/lib/server/adminAuth"
import { startGame } from "@/lib/server/gameStore"

export async function POST(req: NextRequest) {
  try {
    const { adminCode } = await req.json()

    if (!isValidAdminCode(adminCode)) {
      return NextResponse.json({ error: "Mã admin không đúng" }, { status: 403 })
    }

    const game = await startGame()
    return NextResponse.json({ game })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Không thể bắt đầu game" }, { status: 500 })
  }
}
