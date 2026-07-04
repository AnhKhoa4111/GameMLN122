"use client"

import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  async function joinTeam(id: number) {
    await fetch("/api/team-join", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        teamId: id,
        teamName: `Bàn ${id}`,
      }),
    })

    router.push(`/game?team=${id}`)
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-6 py-16">
      <div className="max-w-3xl w-full rounded-3xl border border-gray-800 bg-gray-900/80 p-10 shadow-2xl backdrop-blur">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-yellow-400">
            Giải cứu Việt Nam
          </p>

          <h1 className="mt-4 text-4xl font-black">
            Escape Room Kinh Tế
          </h1>

          <p className="mt-4 text-gray-400 leading-relaxed">
            Chọn đội của bạn và bắt đầu hành trình giải mã để bảo vệ Việt Nam khỏi bẫy tư bản tài chính và quyền lực mềm.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((id) => (
            <button
              key={id}
              onClick={() => joinTeam(id)}
              className="rounded-3xl border border-gray-800 bg-gray-950 px-4 py-6 text-center transition hover:border-red-500 hover:bg-gray-900"
            >
              <div className="text-2xl font-black">Bàn {id}</div>
              <p className="mt-2 text-sm text-gray-400">
                Bắt đầu ngay với đội {id}.
              </p>
            </button>
          ))}
        </div>
      </div>
    </main>
  )
}