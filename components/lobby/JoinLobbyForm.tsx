"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Button from "@/components/ui/Button"
import {
  PLAYER_ID_STORAGE_KEY,
  PLAYER_NAME_STORAGE_KEY,
} from "@/lib/constants/storage"
import { ROUTES } from "@/lib/constants/routes"

export default function JoinLobbyForm() {
  const router = useRouter()
  const [playerName, setPlayerName] = useState("")
  const [isCheckingResume, setIsCheckingResume] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const savedPlayerId = localStorage.getItem(PLAYER_ID_STORAGE_KEY)
    if (!savedPlayerId) {
      setIsCheckingResume(false)
      return
    }

    async function resumeSavedPlayer() {
      try {
        const response = await fetch(`/api/player-state?id=${savedPlayerId}`)
        const data = await response.json()

        if (!response.ok || !data.player) {
          localStorage.removeItem(PLAYER_ID_STORAGE_KEY)
          localStorage.removeItem(PLAYER_NAME_STORAGE_KEY)
          setIsCheckingResume(false)
          return
        }

        localStorage.setItem(PLAYER_NAME_STORAGE_KEY, data.player.player_name)
        router.replace(data.player.start_time ? ROUTES.game : ROUTES.lobby)
      } catch {
        setIsCheckingResume(false)
      }
    }

    resumeSavedPlayer()
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

      localStorage.setItem(PLAYER_ID_STORAGE_KEY, data.player.id)
      localStorage.setItem(PLAYER_NAME_STORAGE_KEY, data.player.player_name)
      router.push(ROUTES.lobby)
    } catch {
      setError("Không thể kết nối database.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isCheckingResume) {
    return (
      <p className="text-center text-lg font-bold text-[var(--game-white)]">
        Đang kiểm tra lượt chơi trước...
      </p>
    )
  }

  return (
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

      {error && <p className="text-center text-sm font-bold text-red-200">{error}</p>}

      <Button
        onClick={handleJoinGame}
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? "Đang vào lobby..." : "Vào trò chơi!"}
      </Button>
    </div>
  )
}
