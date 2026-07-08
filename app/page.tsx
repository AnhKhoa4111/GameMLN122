"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()
  const [playerName, setPlayerName] = useState("")

  const handleJoinGame = () => {
    const name = playerName.trim()

    if (!name) {
      alert("Vui lòng nhập tên của bạn!")
      return
    }

    localStorage.setItem("playerName", name)
    router.push("/lobby")
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--game-bg)] px-4">
      <div className="flex w-full max-w-[520px] flex-col items-center">
        <h1 className="max-w-4xl text-center font-extrabold leading-[0.95] tracking-tight text-black">
          <span className="mb-3 block text-[42px] leading-none text-[#FFC857] drop-shadow-[4px_4px_0px_rgba(0,0,0,0.25)] md:text-[56px]">
            GIẢI MÃ
          </span>

          <span className="relative mt-4 inline-block text-[64px] leading-none tracking-[-0.06em] text-[var(--game-white)] md:text-[96px]">
            <span className="relative z-10">TƯ BẢN</span>
            <span className="absolute bottom-2 left-1 right-1 z-0 h-5 rounded-full bg-[#FFC857] md:h-7" />
          </span>
        </h1>

        <div className="w-full max-w-[420px] bg-[var(--game-bg-dark)] px-12 py-10 shadow-[8px_8px_0px_rgba(0,0,0,0.25)]">
          <div className="space-y-4">
            <label className="block text-center text-lg font-bold text-[var(--game-white)]">
              Nhập tên của bạn
            </label>

            <input
              value={playerName}
              onChange={(event) => setPlayerName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleJoinGame()
                }
              }}
              maxLength={20}
              placeholder="Ví dụ: An"
              className="w-full border-4 border-[var(--game-white)] bg-[var(--game-bg-light)] px-4 py-3 text-center text-lg font-bold text-[var(--game-white)] outline-none placeholder:text-white/70 focus:bg-[var(--game-bg-focus)]"
            />

            <button
              onClick={handleJoinGame}
              className="w-full border-4 border-[var(--game-white)] bg-[var(--game-yellow)] py-3 text-lg font-black text-[var(--game-bg-dark)] shadow-[4px_4px_0px_rgba(0,0,0,0.25)] transition-colors duration-200 hover:bg-[var(--game-yellow-hover)]"
            >
              Vào trò chơi!
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}