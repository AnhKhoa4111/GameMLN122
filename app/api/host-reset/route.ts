import { NextRequest, NextResponse } from "next/server"
import { resetGame, setSession } from "@/lib/kv"

export async function POST(req: NextRequest) {
    try {
        const { hostCode } = await req.json()
        if (hostCode !== process.env.HOST_CODE && hostCode !== "giaicuu2025") {
            return NextResponse.json({ error: "Mã host không đúng" }, { status: 403 })
        }
        await resetGame()
        await setSession({ isActive: true, startTime: Date.now(), hostCode })
        return NextResponse.json({ ok: true })
    } catch {
        return NextResponse.json({ error: "Lỗi server" }, { status: 500 })
    }
}