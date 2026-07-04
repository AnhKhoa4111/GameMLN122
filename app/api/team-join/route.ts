import { NextRequest, NextResponse } from "next/server"
import { getTeam, setTeam } from "@/lib/kv"

export async function POST(req: NextRequest) {
    try {
        const { teamId, teamName } = await req.json()
        if (!teamId || teamId < 1 || teamId > 15) {
            return NextResponse.json({ error: "Team ID không hợp lệ" }, { status: 400 })
        }

        const existing = await getTeam(teamId)
        if (existing) {
            return NextResponse.json({ team: existing })
        }

        const team = {
            teamId,
            teamName: teamName || `Bàn ${teamId}`,
            currentRoom: 1,
            completedRooms: [],
            score: 0,
            hintsUsed: 0,
            startTime: Date.now(),
            roomTimes: {},
            codeFragments: [],
        }
        await setTeam(teamId, team)
        return NextResponse.json({ team })
    } catch {
        return NextResponse.json({ error: "Lỗi server" }, { status: 500 })
    }
}