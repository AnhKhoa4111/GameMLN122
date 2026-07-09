"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { APP_ROUTES } from "@/lib/constants/routes"
import { PLAYER_ID_KEY } from "@/lib/constants/storage"
import type { Player } from "@/lib/types/player"
import { formatDurationMinutes } from "@/lib/utils"

export default function GameCompletePage() {
    const router = useRouter()
    const [player, setPlayer] = useState<Player | null>(null)
    const [error, setError] = useState("")

    useEffect(() => {
        const playerId = localStorage.getItem(PLAYER_ID_KEY)

        if (!playerId) {
            router.push(APP_ROUTES.home)
            return
        }

        async function loadPlayer() {
            const response = await fetch(`/api/player-state?id=${playerId}`)
            const data = await response.json()

            if (!response.ok || !data.player) {
                router.push(APP_ROUTES.home)
                return
            }

            setPlayer(data.player)
        }

        loadPlayer().catch(() => setError("Không thể tải kết quả."))
    }, [router])

    if (!player) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[var(--game-bg)] px-4 text-[var(--game-white)]">
                <div className="border-4 border-[var(--game-white)] bg-[var(--game-bg-dark)] p-8 text-center shadow-[8px_8px_0px_rgba(0,0,0,0.25)]">
                    <p className="text-xl font-black text-[var(--game-yellow)]">
                        Đang tải kết quả...
                    </p>

                    {error && (
                        <p className="mt-3 text-sm font-bold text-red-200">{error}</p>
                    )}
                </div>
            </main>
        )
    }

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--game-bg)] px-4 py-10 text-[var(--game-white)]">
            <div className="pointer-events-none absolute right-[-120px] top-20 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 left-[-120px] h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl" />

            <div className="case-enter relative w-full max-w-[720px] overflow-hidden rounded-[32px] border-4 border-[var(--game-white)] bg-[linear-gradient(135deg,#3f1048,#1b102b)] p-8 text-center shadow-[12px_12px_0px_rgba(0,0,0,0.4)]">
                <div className="pointer-events-none absolute -right-10 -top-10 text-9xl opacity-10">
                    🇻🇳
                </div>

                <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border-4 border-[var(--game-white)] bg-[var(--game-yellow)] text-7xl shadow-[6px_6px_0px_rgba(0,0,0,0.35)]">
                    🏆
                </div>

                <p className="mt-6 text-sm font-black uppercase tracking-[0.26em] text-[var(--game-yellow)]">
                    Mission Complete
                </p>

                <h1 className="mt-4 text-4xl font-black uppercase leading-tight text-[var(--game-yellow)] md:text-6xl">
                    Hoàn thành game!
                </h1>

                <p className="mx-auto mt-4 max-w-xl text-base font-bold leading-relaxed text-white/80">
                    Cảm ơn bạn đã tham gia trò chơi và hoàn thành hành trình bảo vệ chủ
                    quyền kinh tế Việt Nam.
                </p>

                <div className="mx-auto mt-7 max-w-md rounded-[28px] border-4 border-[var(--game-white)] bg-[var(--game-bg-light)] p-6 shadow-[6px_6px_0px_rgba(0,0,0,0.3)]">
                    <p className="text-lg font-black text-white/80">
                        Tổng điểm của bạn
                    </p>

                    <p className="mt-2 text-7xl font-black text-[var(--game-yellow)] drop-shadow-[4px_4px_0px_rgba(0,0,0,0.35)]">
                        {player.score}
                    </p>

                    <p className="mt-1 text-xl font-black uppercase text-white">
                        điểm
                    </p>
                </div>

                <div className="mt-6 rounded-[22px] border-4 border-white/30 bg-black/20 p-4">
                    <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--game-yellow)]">
                        Người chơi
                    </p>

                    <p className="mt-2 text-2xl font-black">{player.player_name}</p>
                </div>

                <div className="mt-4 rounded-[22px] border-4 border-white/30 bg-black/20 p-4">
                    <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--game-yellow)]">
                        Thời gian hoàn thành
                    </p>

                    <p className="mt-2 text-2xl font-black">
                        {formatDurationMinutes(player.start_time, player.finish_time)}
                    </p>
                </div>

                <p className="mt-6 text-lg font-black text-white">
                    Việt Nam đã bảo vệ được chủ quyền kinh tế trước sự chi phối của tư bản tài chính và độc quyền hiện đại.
                </p>
            </div>
        </main>
    )
}
