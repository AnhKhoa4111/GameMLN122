"use client"
import { useEffect, useState, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ROOMS, GAME_CONFIG } from "@/lib/gameData"
import type { TeamState } from "@/lib/kv"
import RoomSortQuestion from "@/components/RoomSortQuestion"
import RoomClassifyQuestion from "@/components/RoomClassifyQuestion"
import RoomFollowMoney from "@/components/RoomFollowMoney"
import RoomScenario from "@/components/RoomScenario"
import RoomEssay from "@/components/RoomEssay"

export default function GameClient() {
    const router = useRouter()
    const params = useSearchParams()
    const teamId = Number(params.get("team"))

    const [team, setTeam] = useState<TeamState | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [elapsed, setElapsed] = useState(0)
    const [roomComplete, setRoomComplete] = useState(false)
    const [earnedScore, setEarnedScore] = useState(0)
    const [hintVisible, setHintVisible] = useState(false)
    const [usedHintThisRoom, setUsedHintThisRoom] = useState(false)

    const fetchTeam = useCallback(async () => {
        const res = await fetch(`/api/team-state?id=${teamId}`)
        if (!res.ok) {
            router.push("/")
            return
        }
        const data = await res.json()
        setTeam(data.team)
    }, [teamId, router])

    useEffect(() => {
        if (!teamId) {
            router.push("/")
            return
        }
        fetchTeam().finally(() => setLoading(false))
    }, [teamId, fetchTeam])

    useEffect(() => {
        if (!team) return
        const interval = setInterval(() => {
            setElapsed(Math.floor((Date.now() - team.startTime) / 1000))
        }, 1000)
        return () => clearInterval(interval)
    }, [team])

    useEffect(() => {
        setRoomComplete(false)
        setUsedHintThisRoom(false)
        setHintVisible(false)
    }, [team?.currentRoom])

    async function completeRoom(roomId: number) {
        const res = await fetch("/api/game/complete-room", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ teamId, roomId, usedHint: usedHintThisRoom }),
        })
        const data = await res.json()
        setTeam(data.team)
        setEarnedScore(data.earnedScore)
        setRoomComplete(true)
    }

    if (loading) return <FullScreenMsg icon="⏳" text="Đang kết nối..." />
    if (error) return <FullScreenMsg icon="❌" text={error} />
    if (!team) return <FullScreenMsg icon="🔍" text="Không tìm thấy nhóm" />

    const totalSecs = GAME_CONFIG.gameDurationMinutes * 60
    const remaining = Math.max(0, totalSecs - elapsed)
    const mins = Math.floor(remaining / 60).toString().padStart(2, "0")
    const secs = (remaining % 60).toString().padStart(2, "0")
    const timerWarning = remaining < 300

    const currentRoom = ROOMS.find((r) => r.id === team.currentRoom)
    const allDone = team.completedRooms.length === 5

    return (
        <div className="min-h-screen bg-gray-950 flex flex-col">
            <header className="sticky top-0 z-50 bg-gray-900 border-b border-gray-800 px-4 py-3">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-vn-red text-white text-xs font-black px-3 py-1 rounded-full">
                            {team.teamName}
                        </div>
                        <div className="text-gray-400 text-sm">Phòng {team.currentRoom}/5</div>
                    </div>
                    <div className={`font-mono text-2xl font-black ${timerWarning ? "text-red-400 animate-pulse" : "text-vn-yellow"}`}>
                        {mins}:{secs}
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-400">💎 <span className="text-white font-bold">{team.score}</span></span>
                        <span className="text-gray-400">💡 <span className="text-white font-bold">{GAME_CONFIG.hintsPerTeam - team.hintsUsed}</span></span>
                    </div>
                </div>
            </header>

            <div className="bg-gray-900 border-b border-gray-800 px-4 py-2">
                <div className="max-w-4xl mx-auto flex gap-2">
                    {ROOMS.map((r) => {
                        const done = team.completedRooms.includes(r.id)
                        const current = r.id === team.currentRoom
                        return (
                            <div key={r.id} className={`flex-1 h-2 rounded-full transition-all ${done ? "bg-green-500" : current ? "bg-vn-red animate-pulse-slow" : "bg-gray-700"}`} />
                        )
                    })}
                </div>
            </div>

            <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
                {allDone ? (
                    <WinScreen team={team} />
                ) : roomComplete ? (
                    <RoomCompleteScreen room={currentRoom!} score={earnedScore} onNext={() => { setRoomComplete(false); fetchTeam() }} isLast={team.currentRoom === 5} />
                ) : currentRoom ? (
                    <div className="animate-fade-in">
                        <div className={`rounded-2xl border-2 ${currentRoom.borderColor} ${currentRoom.bgColor} bg-opacity-10 p-6 mb-6`}>
                            <div className="flex items-center gap-4">
                                <span className="text-5xl">{currentRoom.icon}</span>
                                <div>
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Phòng {currentRoom.id} / 5</div>
                                    <h1 className={`text-2xl font-black ${currentRoom.color}`}>{currentRoom.title}</h1>
                                    <p className="text-gray-400 text-sm mt-1">{currentRoom.description}</p>
                                </div>
                            </div>
                        </div>
                        {team.hintsUsed < GAME_CONFIG.hintsPerTeam && !usedHintThisRoom && (
                            <div className="mb-4 text-right">
                                <button onClick={() => { setHintVisible(true); setUsedHintThisRoom(true) }} className="text-xs bg-gray-800 border border-gray-600 text-yellow-400 px-3 py-1.5 rounded-lg hover:bg-gray-700 transition-colors">💡 Dùng gợi ý (-2 phút điểm thưởng)</button>
                            </div>
                        )}
                        {currentRoom.questions[0].type === "sort" && <RoomSortQuestion question={currentRoom.questions[0]} hintVisible={hintVisible} onComplete={() => completeRoom(currentRoom.id)} />}
                        {currentRoom.questions[0].type === "classify" && <RoomClassifyQuestion question={currentRoom.questions[0]} hintVisible={hintVisible} onComplete={() => completeRoom(currentRoom.id)} />}
                        {currentRoom.questions[0].type === "followmoney" && <RoomFollowMoney question={currentRoom.questions[0]} hintVisible={hintVisible} onComplete={() => completeRoom(currentRoom.id)} />}
                        {currentRoom.questions[0].type === "scenario" && <RoomScenario question={currentRoom.questions[0]} hintVisible={hintVisible} onComplete={() => completeRoom(currentRoom.id)} />}
                        {currentRoom.questions[0].type === "essay" && <RoomEssay question={currentRoom.questions[0]} codeFragments={team.codeFragments} hintVisible={hintVisible} onComplete={() => completeRoom(currentRoom.id)} />}
                    </div>
                ) : null}
            </main>
        </div>
    )
}

function FullScreenMsg({ icon, text }: { icon: string; text: string }) {
    return (
        <div className="min-h-screen flex items-center justify-center flex-col gap-4">
            <div className="text-5xl">{icon}</div>
            <p className="text-gray-400">{text}</p>
        </div>
    )
}

function RoomCompleteScreen({ room, score, onNext, isLast }: { room: typeof ROOMS[0]; score: number; onNext: () => void; isLast: boolean }) {
    return (
        <div className="text-center animate-slide-up py-12">
            <div className="text-7xl mb-4">🎉</div>
            <h2 className="text-3xl font-black text-white mb-2">Phòng {room.id} hoàn thành!</h2>
            <p className="text-gray-400 mb-6">Mảnh mật mã: <span className="font-mono text-vn-yellow font-black text-xl">{room.codeFragment}</span></p>
            <div className="inline-block bg-gray-800 border border-gray-700 rounded-2xl px-8 py-4 mb-8">
                <div className="text-gray-400 text-sm">Điểm kiếm được</div>
                <div className="text-4xl font-black text-green-400">+{score}</div>
            </div>
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 text-left mb-8 max-w-lg mx-auto">
                <div className="text-xs text-gray-500 uppercase font-bold mb-2">Giải thích</div>
                <p className="text-gray-300 text-sm leading-relaxed">{room.questions[0].explanation}</p>
            </div>
            <button onClick={onNext} className="bg-vn-red hover:bg-red-700 text-white font-black py-4 px-10 rounded-xl text-lg glow-red transition-all">{isLast ? "🏆 Xem kết quả" : `Vào phòng ${room.id + 1} →`}</button>
        </div>
    )
}

function WinScreen({ team }: { team: TeamState }) {
    const totalTime = team.finishTime ? Math.floor((team.finishTime - team.startTime) / 1000) : null
    return (
        <div className="text-center py-12 animate-slide-up">
            <div className="text-7xl mb-4">🏆</div>
            <h2 className="text-4xl font-black text-gradient mb-2">NHIỆM VỤ HOÀN THÀNH!</h2>
            <p className="text-gray-400 mb-6">Việt Nam đã được bảo vệ khỏi bẫy tư bản tài chính!</p>
            <div className="bg-gray-900 border border-vn-yellow rounded-2xl p-6 max-w-sm mx-auto mb-6 glow-yellow">
                <div className="text-vn-yellow font-mono font-black text-2xl tracking-widest mb-2">TBTC-QMVN</div>
                <div className="text-gray-400 text-sm">Mật mã hoàn chỉnh</div>
            </div>
            <div className="flex justify-center gap-8 text-center mb-8">
                <div>
                    <div className="text-3xl font-black text-white">{team.score}</div>
                    <div className="text-gray-500 text-sm">Tổng điểm</div>
                </div>
                {totalTime && (
                    <div>
                        <div className="text-3xl font-black text-white">{Math.floor(totalTime / 60)}:{(totalTime % 60).toString().padStart(2, "0")}</div>
                        <div className="text-gray-500 text-sm">Thời gian</div>
                    </div>
                )}
                <div>
                    <div className="text-3xl font-black text-white">{team.hintsUsed}</div>
                    <div className="text-gray-500 text-sm">Gợi ý dùng</div>
                </div>
            </div>
            <a href="/host" className="text-gray-500 text-sm underline">Xem bảng xếp hạng toàn lớp →</a>
        </div>
    )
}
