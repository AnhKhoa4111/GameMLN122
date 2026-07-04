"use client"
import type { RoomQuestion } from "@/lib/gameData"

export default function RoomSortQuestion({
    question,
    hintVisible,
    onComplete,
}: {
    question: RoomQuestion
    hintVisible: boolean
    onComplete: () => void
}) {
    return (
        <section className="space-y-4 rounded-3xl border border-gray-800 bg-gray-900 p-6 shadow-xl">
            <div>
                <div className="text-sm uppercase tracking-[0.2em] text-gray-500">Sắp xếp</div>
                <h2 className="text-2xl font-black text-white">{question.title}</h2>
                <p className="text-gray-400 mt-2">{question.prompt}</p>
            </div>
            {hintVisible && <div className="rounded-2xl bg-gray-800 p-4 text-gray-200">Gợi ý: hãy chọn thứ tự logic từ chuẩn bị đến hoàn thành.</div>}
            <button onClick={onComplete} className="w-full rounded-2xl bg-vn-red px-5 py-3 text-white font-black hover:bg-red-600 transition">
                Hoàn thành bài toán
            </button>
        </section>
    )
}
