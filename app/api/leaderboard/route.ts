import { NextResponse } from "next/server"
import { getAllTeams } from "@/lib/kv"

export async function GET() {
    try {
        const teams = await getAllTeams()
        const sorted = teams.sort((a, b) => {
            if (b.completedRooms.length !== a.completedRooms.length)
                return b.completedRooms.length - a.completedRooms.length
            if (b.score !== a.score) return b.score - a.score
            return (a.finishTime || Infinity) - (b.finishTime || Infinity)
        })
        return NextResponse.json({ teams: sorted })
    } catch {
        return NextResponse.json({ error: "Lỗi server" }, { status: 500 })
    }
}