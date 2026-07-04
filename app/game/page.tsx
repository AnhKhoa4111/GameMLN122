import { Suspense } from "react"
import GameClient from "@/components/GameClient"

export default function GamePage() {
    return (
        <section>
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Đang tải trò chơi...</div>}>
                <GameClient />
            </Suspense>
        </section>
    )
}
