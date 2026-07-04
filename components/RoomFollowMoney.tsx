"use client"

import { useState } from "react"
import type { RoomQuestion } from "@/lib/gameData"

export default function RoomClassifyQuestion({
  question,
  hintVisible,
  onComplete,
}: {
  question: RoomQuestion
  hintVisible: boolean
  onComplete: () => void
}) {
  const [selected, setSelected] = useState("")
  const [error, setError] = useState("")

  function handleSubmit() {
    if (question.answer?.includes(selected)) {
      setError("")
      onComplete()
    } else {
      setError("Sai rồi, hãy đọc kỹ lý thuyết và chọn lại.")
    }
  }

  return (
    <section className="space-y-4 rounded-3xl border border-gray-800 bg-gray-900 p-6 shadow-xl">
      <div>
        <div className="text-sm uppercase tracking-[0.2em] text-gray-500">
          Phân loại
        </div>
        <h2 className="text-2xl font-black text-white">{question.title}</h2>
        <p className="mt-2 text-gray-400">{question.prompt}</p>
      </div>

      {hintVisible && (
        <div className="rounded-2xl bg-gray-800 p-4 text-gray-200">
          Gợi ý: {question.hint}
        </div>
      )}

      <div className="space-y-3">
        {question.options?.map((option) => (
          <button
            key={option}
            onClick={() => setSelected(option)}
            className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
              selected === option
                ? "border-vn-yellow bg-vn-yellow/10 text-vn-yellow"
                : "border-gray-700 bg-gray-950 text-gray-300 hover:border-gray-500"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        onClick={handleSubmit}
        className="w-full rounded-2xl bg-vn-red px-5 py-3 font-black text-white transition hover:bg-red-600"
      >
        Xác nhận đáp án
      </button>
    </section>
  )
}