"use client"
import type { RoomQuestion } from "@/lib/gameData"

export default function RoomEssay({
    question,
    codeFragments,
    hintVisible,
    onComplete,
}: {
    question: RoomQuestion
    codeFragments: string[]
    hintVisible: boolean
    onComplete: () => void
}) {
    return (
        <section className="space-y-4 rounded-3xl border border-gray-800 bg-gray-900 p-6 shadow-xl">
            <div>
                <div className="text-sm uppercase tracking-[0.2em] text-gray-500">Bài luận</div>
                <h2 className="text-2xl font-black text-white">{question.title}</h2>
                <p className="text-gray-400 mt-2">{question.prompt}</p>
            </div>
            {hintVisible && <div className="rounded-2xl bg-gray-800 p-4 text-gray-200">Gợi ý: kết hợp các mật mã trong khoá học để tạo câu trả lời.</div>}
            <div className="rounded-3xl border border-gray-800 bg-gray-950 p-4 text-gray-200">
                <div className="text-sm text-gray-500 mb-2">Mật mã thu thập</div>
                <div className="flex flex-wrap gap-2">
                    {codeFragments.length ? codeFragments.map(fragment => (
                        <span key={fragment} className="rounded-full bg-gray-800 px-3 py-1 text-xs uppercase tracking-[0.15em]">{fragment}</span>
                    )) : <span className="text-gray-500">Chưa có mật mã</span>}
                </div>
            </div>
            <button onClick={onComplete} className="w-full rounded-2xl bg-vn-red px-5 py-3 text-white font-black hover:bg-red-600 transition">
                Hoàn thành bài toán
            </button>
        </section>
    )
}
