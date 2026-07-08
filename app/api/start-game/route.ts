import { NextRequest, NextResponse } from "next/server"
import { startGame } from "@/lib/server/gameStore"

export async function POST(req: NextRequest) {
  try {
    const { adminCode } = await req.json()
    const expectedCode = process.env.ADMIN_CODE ?? process.env.HOST_CODE ?? "admin"

    if (String(adminCode ?? "") !== expectedCode) {
      return NextResponse.json({ error: "Mã admin không đúng" }, { status: 403 })
    }

    const game = await startGame()
    return NextResponse.json({ game })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Không thể bắt đầu game" }, { status: 500 })
  }
}
