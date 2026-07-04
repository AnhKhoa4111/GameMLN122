import { NextRequest, NextResponse } from "next/server"
import { getTeam, setTeam } from "@/lib/kv"
import { ROOMS, GAME_CONFIG } from "@/lib/gameData"

export async function POST(req: NextRequest) {
    try {
        const { teamId, roomId, usedHint } = await req.json()
        const team = await getTeam(teamId)
        if (!team) return NextResponse.json({ error: "Team không tồn tại" }, { status: 404 })
        if (team.completedRooms.includes(roomId)) {
            return NextResponse.json({ team })
        }

        const room = ROOMS.find(r => r.id === roomId)
        if (!room) return NextResponse.json({ error: "Room không tồn tại" }, { status: 404 })

        const timeNow = Date.now()
        const roomTime = Math.floor((timeNow - (team.roomTimes[roomId] || team.startTime)) / 1000)
        const hintPenalty = usedHint ? GAME_CONFIG.hintPenaltySeconds : 0
        const baseScore = Math.max(0, 1000 - Math.floor(roomTime / 10) * 5 - hintPenalty)

        const updated = {
            ...team,
            completedRooms: [...team.completedRooms, roomId],
            currentRoom: roomId < 5 ? roomId + 1 : roomId,
            score: team.score + baseScore,
            hintsUsed: team.hintsUsed + (usedHint ? 1 : 0),
            codeFragments: [...team.codeFragments, room.codeFragment],
            roomTimes: { ...team.roomTimes, [roomId]: timeNow },
            ...(roomId === 5 ? { finishTime: timeNow } : {}),
        }

        await setTeam(teamId, updated)
        return NextResponse.json({ team: updated, earnedScore: baseScore })
    } catch {
        return NextResponse.json({ error: "Lỗi server" }, { status: 500 })
    }
}