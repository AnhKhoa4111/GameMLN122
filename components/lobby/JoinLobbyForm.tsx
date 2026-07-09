"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { APP_ROUTES } from "@/lib/constants/routes"
import { PLAYER_ID_KEY, PLAYER_NAME_KEY } from "@/lib/constants/storage"

export default function JoinLobbyForm() {
  const router = useRouter()
  const [playerName, setPlayerName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCheckingSavedPlayer, setIsCheckingSavedPlayer] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const savedPlayerId = localStorage.getItem(PLAYER_ID_KEY)

    if (!savedPlayerId) {
      setIsCheckingSavedPlayer(false)
      return
    }

    async function validateSavedPlayer() {
      try {
        const response = await fetch(`/api/player-state?id=${savedPlayerId}`)
        const data = await response.json()

        if (!response.ok || !data.player) {
          localStorage.removeItem(PLAYER_ID_KEY)
          localStorage.removeItem(PLAYER_NAME_KEY)
          setIsCheckingSavedPlayer(false)
          return
        }

        router.push(data.player.start_time ? APP_ROUTES.game : APP_ROUTES.lobby)
      } catch {
        setIsCheckingSavedPlayer(false)
      }
    }

    validateSavedPlayer()
  }, [router])

  async function handleJoinGame() {
    const name = playerName.trim()

    if (name.length < 2) {
      setError("Vui lòng nhập tên ít nhất 2 ký tự.")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch("/api/join-lobby", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerName: name }),
      })
      const data = await response.json()

      if (!response.ok) {
        setError(data.error ?? "Không thể vào lobby.")
        return
      }

      localStorage.setItem(PLAYER_ID_KEY, data.player.id)
      localStorage.setItem(PLAYER_NAME_KEY, data.player.player_name)
      router.push(APP_ROUTES.lobby)
    } catch {
      setError("Không thể kết nối database.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isCheckingSavedPlayer) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--game-bg)] px-4 text-[var(--game-white)]">
        <p className="text-xl font-black text-[var(--game-yellow)]">
          Đang kiểm tra người chơi...
        </p>
      </main>
    )
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

            {error && (
              <p className="text-center text-sm font-bold text-red-200">
                {error}
              </p>
            )}

            <button
              onClick={handleJoinGame}
              disabled={isSubmitting}
              className="w-full border-4 border-[var(--game-white)] bg-[var(--game-yellow)] py-3 text-lg font-black text-[var(--game-bg-dark)] shadow-[4px_4px_0px_rgba(0,0,0,0.25)] transition-colors duration-200 hover:bg-[var(--game-yellow-hover)] disabled:cursor-wait disabled:opacity-70"
            >
              {isSubmitting ? "Đang vào lobby..." : "Vào trò chơi!"}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
