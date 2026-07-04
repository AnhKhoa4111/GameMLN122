import { NextRequest, NextResponse } from "next/server"
import { getTeam } from "@/lib/kv"

export async function GET(req: NextRequest) {
    const id = Number(req.nextUrl.searchParams.get("id"))
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
    const team = await getTeam(id)
    if (!team) return NextResponse.json({ error: "Team chưa đăng ký" }, { status: 404 })
    return NextResponse.json({ team })
}