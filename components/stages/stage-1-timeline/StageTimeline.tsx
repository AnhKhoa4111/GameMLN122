"use client"

import { useMemo, useState } from "react"
import { stage1TimelineItems } from "@/lib/data/stage1Timeline"
import { scoreStage1 } from "@/lib/scoring/scoreStage1"

type StageTimelineProps = {
    onCompleted: (score: number) => void
    isSubmitting?: boolean
}

const shuffledItems = [
    stage1TimelineItems[5],
    stage1TimelineItems[1],
    stage1TimelineItems[3],
    stage1TimelineItems[0],
    stage1TimelineItems[4],
    stage1TimelineItems[2],
]

export default function StageTimeline({
    onCompleted,
    isSubmitting = false,
}: StageTimelineProps) {
    const [availableCards, setAvailableCards] = useState(shuffledItems)
    const [slots, setSlots] = useState<(string | null)[]>([
        null,
        null,
        null,
        null,
        null,
        null,
    ])
    const [draggedId, setDraggedId] = useState<string | null>(null)
    const [result, setResult] = useState<ReturnType<typeof scoreStage1> | null>(
        null
    )

    const selectedCount = slots.filter(Boolean).length
    const isFull = selectedCount === 6

    const cardsById = useMemo(() => {
        return Object.fromEntries(stage1TimelineItems.map((item) => [item.id, item]))
    }, [])

    function handleDrop(slotIndex: number) {
        if (!draggedId || result) return

        const oldCardIdInSlot = slots[slotIndex]

        const newSlots = slots.map((slot, index) => {
            if (slot === draggedId) return null
            if (index === slotIndex) return draggedId
            return slot
        })

        setSlots(newSlots)

        setAvailableCards((currentCards) => {
            let nextCards = currentCards.filter((card) => card.id !== draggedId)

            if (oldCardIdInSlot) {
                const oldCard = stage1TimelineItems.find(
                    (item) => item.id === oldCardIdInSlot
                )

                if (oldCard) {
                    nextCards = [...nextCards, oldCard]
                }
            }

            return nextCards
        })

        setDraggedId(null)
    }

    function handleRemoveFromSlot(slotIndex: number) {
        if (result) return

        const cardId = slots[slotIndex]
        if (!cardId) return

        const card = stage1TimelineItems.find((item) => item.id === cardId)
        if (!card) return

        setSlots((currentSlots) =>
            currentSlots.map((slot, index) => (index === slotIndex ? null : slot))
        )

        setAvailableCards((currentCards) => [...currentCards, card])
    }

    function handleSubmit() {
        if (!isFull) return

        const orderedIds = slots.filter(Boolean) as string[]
        const scoreResult = scoreStage1(orderedIds)

        setResult(scoreResult)
        onCompleted(scoreResult.score)
    }

    return (
        <section className="mx-auto max-w-6xl px-4 py-8 text-[var(--game-white)]">
            <div className="mb-8 text-center">
                <p className="text-sm font-black uppercase tracking-[0.24em] text-[var(--game-yellow)]">
                    Stage 1
                </p>

                <h1 className="mt-3 text-4xl font-black uppercase md:text-5xl">
                    Kho Lưu Trữ Lênin
                </h1>

                <p className="mx-auto mt-4 max-w-3xl text-base font-semibold text-white/80">
                    Hãy sắp xếp đúng tiến trình hình thành{" "}
                    <span className="text-[var(--game-yellow)]">tư bản tài chính</span>{" "}
                    theo lý luận của Lênin. Kéo 6 thẻ bên trái vào timeline bên phải.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
                <div className="bg-[var(--game-bg-dark)] p-5 shadow-[8px_8px_0px_rgba(0,0,0,0.25)]">
                    <h2 className="mb-4 text-center text-2xl font-black">
                        Thẻ dữ kiện
                    </h2>

                    <div className="grid gap-3">
                        {availableCards.length > 0 ? (
                            availableCards.map((card) => (
                                <div
                                    key={card.id}
                                    draggable={!result}
                                    onDragStart={() => setDraggedId(card.id)}
                                    className="cursor-grab border-4 border-[var(--game-white)] bg-[var(--game-bg-light)] p-4 shadow-[4px_4px_0px_rgba(0,0,0,0.2)] active:cursor-grabbing"
                                >
                                    <h3 className="text-lg font-black">{card.title}</h3>
                                    <p className="mt-2 text-sm font-semibold text-white/80">
                                        {card.description}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="border-4 border-dashed border-white/50 p-6 text-center font-bold text-white/70">
                                Bạn đã kéo hết thẻ vào timeline.
                            </p>
                        )}
                    </div>
                </div>

                <div className="bg-[var(--game-bg-dark)] p-5 shadow-[8px_8px_0px_rgba(0,0,0,0.25)]">
                    <h2 className="mb-4 text-center text-2xl font-black">
                        Timeline tư bản tài chính
                    </h2>

                    <div className="grid gap-3">
                        {slots.map((cardId, index) => {
                            const card = cardId ? cardsById[cardId] : null

                            const isWrong =
                                result !== null && card !== null && card.correctOrder !== index + 1

                            const isCorrect =
                                result !== null && card !== null && card.correctOrder === index + 1

                            return (
                                <div
                                    key={index}
                                    onDragOver={(event) => event.preventDefault()}
                                    onDrop={() => handleDrop(index)}
                                    className={`min-h-[92px] border-4 p-4 transition ${isCorrect
                                            ? "border-green-300 bg-green-600/40"
                                            : isWrong
                                                ? "border-red-300 bg-red-600/40"
                                                : "border-[var(--game-white)] bg-[#3f1048]"
                                        }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[var(--game-yellow)] text-xl font-black text-[var(--game-bg-dark)]">
                                            {index + 1}
                                        </div>

                                        {card ? (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveFromSlot(index)}
                                                className="w-full text-left"
                                            >
                                                <h3 className="text-lg font-black">{card.title}</h3>
                                                <p className="mt-1 text-sm font-semibold text-white/80">
                                                    {card.description}
                                                </p>
                                            </button>
                                        ) : (
                                            <div className="flex min-h-[52px] w-full items-center justify-center border-4 border-dashed border-white/40 text-center font-bold text-white/60">
                                                Kéo thẻ vào đây
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {result && (
                        <div className="mt-5 border-4 border-[var(--game-white)] bg-[var(--game-bg-light)] p-5 text-center">
                            <p className="text-xl font-black">
                                Điểm Stage 1:{" "}
                                <span className="text-[var(--game-yellow)]">
                                    {result.score}
                                </span>
                            </p>

                            <p className="mt-2 font-bold text-white/80">
                                Đúng {result.correctCount}/6 thẻ — Sai {result.wrongCount}/6 thẻ
                            </p>

                            {result.isPerfect && (
                                <p className="mt-3 text-lg font-black text-[var(--game-yellow)]">
                                    Hoàn hảo! Bạn đã giải mã đúng tiến trình hình thành tư bản tài
                                    chính.
                                </p>
                            )}
                        </div>
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={!isFull || Boolean(result) || isSubmitting}
                        className="mt-5 w-full border-4 border-[var(--game-white)] bg-[var(--game-yellow)] py-3 text-lg font-black text-[var(--game-bg-dark)] shadow-[4px_4px_0px_rgba(0,0,0,0.25)] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSubmitting
                            ? "Đang lưu điểm..."
                            : result
                                ? "Đã hoàn thành Stage 1"
                                : "Xác nhận timeline"}
                    </button>
                </div>
            </div>
        </section>
    )
}