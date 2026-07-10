"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"

export default function GameBackgroundMusic() {
  const pathname = usePathname()
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [isMutedByUser, setIsMutedByUser] = useState(false)

  const shouldShowMusicButton =
  pathname === "/" ||
  pathname.startsWith("/lobby") ||
  pathname.startsWith("/game") ||
  pathname.startsWith("/admin")

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = 0.35
    audio.loop = true

    const savedMuted = localStorage.getItem("gameMusicMuted") === "true"

    setIsMutedByUser(savedMuted)

    if (savedMuted) {
      audio.pause()
      setIsPlaying(false)
      return
    }

    const playMusic = async () => {
      try {
        await audio.play()
        setIsPlaying(true)
      } catch {
        setIsPlaying(false)
      }
    }

    playMusic()

    const startAfterFirstAction = () => {
      if (localStorage.getItem("gameMusicMuted") === "true") return

      audio
        .play()
        .then(() => {
          setIsPlaying(true)
        })
        .catch(() => {
          setIsPlaying(false)
        })
    }

    window.addEventListener("click", startAfterFirstAction, { once: true })
    window.addEventListener("keydown", startAfterFirstAction, { once: true })

    return () => {
      window.removeEventListener("click", startAfterFirstAction)
      window.removeEventListener("keydown", startAfterFirstAction)
    }
  }, [])

  async function toggleMusic() {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
      setIsMutedByUser(true)
      localStorage.setItem("gameMusicMuted", "true")
      return
    }

    try {
      await audio.play()
      setIsPlaying(true)
      setIsMutedByUser(false)
      localStorage.setItem("gameMusicMuted", "false")
    } catch {
      alert("Trình duyệt đang chặn nhạc. Hãy bấm lại nút bật nhạc.")
    }
  }

  return (
    <>
      <audio
        ref={audioRef}
        src="/audio/gameMLNmusic.mp3"
        loop
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {shouldShowMusicButton && (
        <button
          type="button"
          onClick={toggleMusic}
          className="fixed bottom-5 right-5 z-[9999] rounded-full border-4 border-[var(--game-white)] bg-[var(--game-bg-dark)] px-4 py-3 text-sm font-black text-[var(--game-yellow)] shadow-[4px_4px_0px_rgba(0,0,0,0.35)] transition hover:-translate-y-1 hover:bg-[var(--game-bg-light)]"
        >
          {isPlaying ? "🔊 Tắt nhạc" : "🔇 Bật nhạc"}
        </button>
      )}
    </>
  )
}