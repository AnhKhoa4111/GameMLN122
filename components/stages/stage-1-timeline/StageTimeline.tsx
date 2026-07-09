"use client"

import { useMemo, useState } from "react"
import {
  stage1TimelineItems,
  type Stage1TimelineItem,
} from "@/lib/data/stage1Timeline"
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

const cardVisuals: Record<
  string,
  {
    icon: string
    role: string
    character: string
    quote: string
    color: string
  }
> = {
  "production-concentration": {
    icon: "🏭",
    role: "Công xưởng khổng lồ",
    character: "Bác thợ máy",
    quote: "Sản xuất càng lớn, doanh nghiệp nhỏ càng khó cạnh tranh!",
    color: "from-orange-400 to-red-500",
  },
  "industrial-monopoly": {
    icon: "🏢",
    role: "Ông trùm công nghiệp",
    character: "Chủ tập đoàn",
    quote: "Khi vài tập đoàn thống trị, độc quyền bắt đầu xuất hiện.",
    color: "from-purple-400 to-fuchsia-600",
  },
  "bank-capital-concentration": {
    icon: "💰",
    role: "Kho bạc ngân hàng",
    character: "Thủ quỹ",
    quote: "Tiền vốn dần chảy về những ngân hàng lớn.",
    color: "from-yellow-300 to-orange-500",
  },
  "bank-monopoly": {
    icon: "🏦",
    role: "Ngân hàng quyền lực",
    character: "Giám đốc ngân hàng",
    quote: "Ngân hàng lớn nắm quyền kiểm soát dòng vốn.",
    color: "from-sky-300 to-blue-600",
  },
  "capital-merger": {
    icon: "🤝",
    role: "Liên minh quyền lực",
    character: "Nhà đàm phán",
    quote: "Tư bản ngân hàng bắt tay với tư bản công nghiệp.",
    color: "from-emerald-300 to-teal-600",
  },
  "financial-capital": {
    icon: "🦁",
    role: "Trùm tư bản tài chính",
    character: "Sư tử tài chính",
    quote: "Tư bản tài chính ra đời khi hai thế lực hợp nhất!",
    color: "from-rose-400 to-pink-600",
  },
}

const confettiItems = ["🎉", "✨", "⭐", "💥", "🎊", "🔥", "🏆", "⚡"]

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
  const [hoveredSlotIndex, setHoveredSlotIndex] = useState<number | null>(null)
  const [lastDroppedSlotIndex, setLastDroppedSlotIndex] = useState<number | null>(
    null
  )
  const [result, setResult] = useState<ReturnType<typeof scoreStage1> | null>(
    null
  )

  const selectedCount = slots.filter(Boolean).length
  const isFull = selectedCount === 6

  const cardsById = useMemo<Record<string, Stage1TimelineItem>>(() => {
    return Object.fromEntries(
      stage1TimelineItems.map((item) => [item.id, item])
    ) as Record<string, Stage1TimelineItem>
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
    setLastDroppedSlotIndex(slotIndex)

    window.setTimeout(() => {
      setLastDroppedSlotIndex(null)
    }, 450)

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
    setHoveredSlotIndex(null)
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
  }

  return (
    <section className="stage-enter relative mx-auto max-w-6xl overflow-hidden px-4 py-4 text-[var(--game-white)]">
      <div className="pointer-events-none absolute right-[-100px] top-64 h-64 w-64 rounded-full bg-fuchsia-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative mb-4 text-center">
        <div className="fade-up mx-auto inline-flex items-center gap-2 border-4 border-[var(--game-white)] bg-[var(--game-bg-dark)] px-4 py-1.5 shadow-[4px_4px_0px_rgba(0,0,0,0.3)]">
          <span className="animate-bounce text-xl">📜</span>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--game-yellow)]">
            Stage 1
          </p>
          <span className="animate-bounce text-xl [animation-delay:0.2s]">
            🔍
          </span>
        </div>

        <h1 className="fade-up fade-delay-1 mt-3 text-3xl font-black uppercase leading-tight md:text-5xl">
          Kho Lưu Trữ{" "}
          <span className="text-[var(--game-yellow)] drop-shadow-[3px_3px_0px_rgba(0,0,0,0.45)]">
            Lênin
          </span>
        </h1>

        <div className="fade-up fade-delay-2 mx-auto mt-3 flex max-w-3xl flex-col items-center gap-3 rounded-[22px] border-4 border-[var(--game-white)] bg-black/25 p-3 shadow-[5px_5px_0px_rgba(0,0,0,0.25)] md:flex-row md:text-left">
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-[var(--game-white)] bg-[var(--game-yellow)] text-4xl shadow-[4px_4px_0px_rgba(0,0,0,0.3)]">
            🧠
            <span className="absolute -right-2 -top-2 animate-ping text-xl">
              ✨
            </span>
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--game-yellow)]">
              Trợ lý kho lưu trữ
            </p>
            <p className="mt-1 text-sm font-semibold text-white/85">
              Kéo các{" "}
              <span className="font-black text-[var(--game-yellow)]">
                nhân vật dữ kiện
              </span>{" "}
              vào đúng timeline để mở khóa quá trình hình thành{" "}
              <span className="font-black text-[var(--game-yellow)]">
                tư bản tài chính
              </span>
              . Bấm vào thẻ đã đặt nếu muốn đổi vị trí.
            </p>
          </div>
        </div>
      </div>

      <div className="case-enter relative grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="fade-up fade-delay-1 relative overflow-hidden rounded-[22px] border-4 border-[var(--game-white)] bg-[linear-gradient(135deg,#3f1048,#1d102d)] p-4 shadow-[8px_8px_0px_rgba(0,0,0,0.28)]">
          <div className="pointer-events-none absolute -right-8 -top-8 text-7xl opacity-10">
            🃏
          </div>

          <div className="mb-3 flex items-center justify-between gap-3 border-b-4 border-[var(--game-white)] pb-3">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
                <span>🎭</span>
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--game-yellow)]">
                  Nhân vật dữ kiện
                </p>
              </div>

              <h2 className="mt-1 text-xl font-black">Đội hình lịch sử</h2>
              <p className="mt-1 text-xs font-bold text-white/70">
                Mỗi nhân vật đại diện cho một bước trong tiến trình.
              </p>
            </div>

            <div className="relative border-4 border-[var(--game-white)] bg-[var(--game-bg-light)] px-3 py-1.5 text-center shadow-[3px_3px_0px_rgba(0,0,0,0.25)]">
              <span className="absolute -right-2 -top-2 text-xl">⚡</span>
              <p className="text-[10px] font-black uppercase text-white/70">
                Đã xếp
              </p>
              <p className="text-xl font-black text-[var(--game-yellow)]">
                {selectedCount}/6
              </p>
            </div>
          </div>

          <div className="grid gap-2">
            {availableCards.length > 0 ? (
              availableCards.map((card, index) => {
                const visual = cardVisuals[card.id]
                const isDragging = draggedId === card.id

                return (
                  <div
                    key={card.id}
                    draggable={!result}
                    onDragStart={() => setDraggedId(card.id)}
                    onDragEnd={() => {
                      setDraggedId(null)
                      setHoveredSlotIndex(null)
                    }}
                    style={{
                      animationDelay: `${0.08 + index * 0.06}s`,
                    }}
                    className={`fade-up group relative cursor-grab overflow-hidden rounded-[18px] border-4 border-[var(--game-white)] bg-[var(--game-bg-light)] p-3 shadow-[4px_4px_0px_rgba(0,0,0,0.25)] transition-all duration-200 active:cursor-grabbing ${
                      isDragging
                        ? "scale-[1.03] rotate-1 border-[var(--game-yellow)] opacity-80 shadow-[0_0_24px_rgba(250,204,21,0.45)]"
                        : "hover:-translate-y-1 hover:rotate-[0.5deg] hover:border-[var(--game-yellow)] hover:shadow-[6px_6px_0px_rgba(0,0,0,0.3)]"
                    }`}
                  >
                    <div
                      className={`absolute inset-y-0 left-0 w-2 bg-gradient-to-b ${
                        visual?.color ?? "from-yellow-300 to-orange-500"
                      }`}
                    />

                    <div className="absolute right-2 top-2 rounded-full bg-black/25 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.12em] text-white/70">
                      Kéo
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border-4 border-[var(--game-white)] bg-[#3f1048] text-3xl shadow-[3px_3px_0px_rgba(0,0,0,0.25)] transition group-hover:scale-110 group-hover:rotate-3">
                        {visual?.icon ?? "📌"}
                      </div>

                      <div className="min-w-0 pr-8">
                        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--game-yellow)]">
                          {visual?.character ?? "Nhân vật"}
                        </p>

                        <h3 className="mt-0.5 text-base font-black leading-tight">
                          {card.title}
                        </h3>

                        <p className="mt-0.5 text-[10px] font-black uppercase tracking-[0.12em] text-white/60">
                          {visual?.role ?? "Dữ kiện"}
                        </p>

                        <p className="mt-1 line-clamp-1 rounded-lg bg-black/20 px-2 py-1 text-xs font-semibold italic text-white/80">
                          “{visual?.quote ?? card.description}”
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="stage-pop rounded-[18px] border-4 border-dashed border-white/50 bg-white/10 p-4 text-center">
                <div className="mx-auto flex h-16 w-16 animate-bounce items-center justify-center text-5xl">
                  ✅
                </div>
                <p className="mt-2 text-lg font-black text-[var(--game-yellow)]">
                  Đội hình đã vào timeline!
                </p>
                <p className="mt-1 text-xs font-bold text-white/70">
                  Bấm xác nhận để kiểm tra đáp án.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="fade-up fade-delay-2 relative overflow-hidden rounded-[22px] border-4 border-[var(--game-white)] bg-[linear-gradient(135deg,#221038,#3f1048)] p-4 shadow-[8px_8px_0px_rgba(0,0,0,0.28)]">
          <div className="pointer-events-none absolute -left-10 top-16 text-8xl opacity-10">
            🧩
          </div>

          <div className="mb-3 border-b-4 border-[var(--game-white)] pb-3 text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
              <span>🛤️</span>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--game-yellow)]">
                Đường tiến hóa tư bản
              </p>
            </div>

            <h2 className="mt-1 text-xl font-black">
              Timeline tư bản tài chính
            </h2>
            <p className="mt-1 text-xs font-bold text-white/70">
              Thả đúng thứ tự để hoàn thành chuỗi lý luận của Lênin.
            </p>
          </div>

          <div className="relative grid gap-2">
            <div className="pointer-events-none absolute left-[22px] top-5 hidden h-[calc(100%-40px)] w-1 bg-[var(--game-yellow)]/35 md:block" />

            {slots.map((cardId, index) => {
              const card = cardId ? cardsById[cardId] : null

              const isWrong =
                result !== null && card !== null && card.correctOrder !== index + 1

              const isCorrect =
                result !== null && card !== null && card.correctOrder === index + 1

              const isHovering = hoveredSlotIndex === index
              const isRecentlyDropped = lastDroppedSlotIndex === index
              const visual = card ? cardVisuals[card.id] : null

              return (
                <div
                  key={index}
                  onDragOver={(event) => {
                    event.preventDefault()
                    if (!result) setHoveredSlotIndex(index)
                  }}
                  onDragLeave={() => setHoveredSlotIndex(null)}
                  onDrop={() => handleDrop(index)}
                  className={`relative min-h-[78px] rounded-[18px] border-4 p-3 transition-all duration-200 ${
                    isCorrect
                      ? "border-green-300 bg-green-600/40 shadow-[0_0_20px_rgba(74,222,128,0.3)]"
                      : isWrong
                        ? "border-red-300 bg-red-600/40 shadow-[0_0_20px_rgba(248,113,113,0.3)]"
                        : isHovering
                          ? "scale-[1.01] border-[var(--game-yellow)] bg-yellow-400/20 shadow-[0_0_22px_rgba(250,204,21,0.35)]"
                          : "border-[var(--game-white)] bg-[#3f1048]/90"
                  } ${isRecentlyDropped ? "stage-pop" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-4 border-[var(--game-white)] bg-[var(--game-yellow)] text-lg font-black text-[var(--game-bg-dark)] shadow-[3px_3px_0px_rgba(0,0,0,0.25)]">
                      {index + 1}
                      {isCorrect && (
                        <span className="absolute -right-2 -top-2 text-xl">
                          ✅
                        </span>
                      )}
                      {isWrong && (
                        <span className="absolute -right-2 -top-2 text-xl">
                          ❌
                        </span>
                      )}
                    </div>

                    {card ? (
                      <button
                        type="button"
                        onClick={() => handleRemoveFromSlot(index)}
                        className="group flex w-full items-center gap-3 text-left"
                      >
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-4 border-[var(--game-white)] bg-[var(--game-bg-light)] text-3xl shadow-[3px_3px_0px_rgba(0,0,0,0.25)] transition group-hover:scale-105">
                          {visual?.icon ?? "📌"}
                        </div>

                        <div className="min-w-0">
                          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--game-yellow)]">
                            Mốc {index + 1} · {visual?.character ?? "Dữ kiện"}
                          </p>
                          <h3 className="mt-0.5 text-base font-black">
                            {card.title}
                          </h3>
                          <p className="mt-0.5 line-clamp-1 text-xs font-semibold text-white/80">
                            {card.description}
                          </p>
                        </div>
                      </button>
                    ) : (
                      <div className="flex min-h-[44px] w-full items-center justify-center rounded-xl border-4 border-dashed border-white/40 bg-black/20 text-center text-sm font-black text-white/60">
                        {isHovering ? (
                          <span className="animate-pulse text-[var(--game-yellow)]">
                            Thả nhân vật vào đây!
                          </span>
                        ) : (
                          <span>Kéo thẻ vào mốc này</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-3 rounded-[18px] border-4 border-white/30 bg-black/20 p-3">
            <div className="mb-2 flex items-center justify-between text-xs font-black">
              <span>Tiến độ giải mã</span>
              <span className="text-[var(--game-yellow)]">
                {selectedCount}/6
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full border-2 border-[var(--game-white)] bg-black/30">
              <div
                className="h-full bg-[var(--game-yellow)] transition-all duration-500"
                style={{ width: `${(selectedCount / 6) * 100}%` }}
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!isFull || Boolean(result) || isSubmitting}
            className="mt-3 w-full rounded-[18px] border-4 border-[var(--game-white)] bg-[var(--game-yellow)] py-3 text-base font-black uppercase text-[var(--game-bg-dark)] shadow-[4px_4px_0px_rgba(0,0,0,0.3)] transition hover:-translate-y-1 hover:bg-[var(--game-yellow-hover)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {isSubmitting
              ? "Đang lưu điểm..."
              : result
                ? "Đã hoàn thành Stage 1"
                : isFull
                  ? "Xác nhận timeline"
                  : "Xếp đủ 6 thẻ để xác nhận"}
          </button>
        </div>
      </div>

      {result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/75 px-4 backdrop-blur-sm">
          {confettiItems.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="pointer-events-none absolute animate-bounce text-4xl"
              style={{
                left: `${10 + index * 11}%`,
                top: `${index % 2 === 0 ? 12 : 22}%`,
                animationDelay: `${index * 0.12}s`,
              }}
            >
              {item}
            </span>
          ))}

          <div className="case-enter relative w-full max-w-[520px] overflow-hidden rounded-[28px] border-4 border-[var(--game-white)] bg-[linear-gradient(135deg,#3f1048,#1b102b)] p-5 text-center shadow-[10px_10px_0px_rgba(0,0,0,0.4)]">
            <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-fuchsia-400/15 blur-2xl" />

            <div className="relative mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full border-4 border-[var(--game-white)] bg-[var(--game-yellow)] text-5xl shadow-[5px_5px_0px_rgba(0,0,0,0.35)]">
              {result.isPerfect ? "🏆" : "📊"}
              <span className="absolute -right-3 -top-2 animate-ping text-2xl">
                ✨
              </span>
            </div>

            <p className="relative text-xs font-black uppercase tracking-[0.22em] text-[var(--game-yellow)]">
              Hoàn thành Stage 1
            </p>

            <h2 className="relative mt-2 text-2xl font-black uppercase leading-tight text-[var(--game-white)] md:text-3xl">
              Kho Lưu Trữ Lênin
            </h2>

            <div className="relative mt-4 rounded-[22px] border-4 border-[var(--game-white)] bg-[var(--game-bg-light)] p-4 shadow-[4px_4px_0px_rgba(0,0,0,0.28)]">
              <p className="text-base font-black text-white/80">
                Bạn đã cộng được
              </p>

              <p className="mt-1 animate-pulse text-6xl font-black text-[var(--game-yellow)] drop-shadow-[3px_3px_0px_rgba(0,0,0,0.35)]">
                +{result.score}
              </p>

              <p className="text-lg font-black uppercase text-white">điểm</p>
            </div>

            <div className="relative mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border-4 border-green-300 bg-green-500/25 p-2">
                <p className="text-2xl">✅</p>
                <p className="mt-1 text-xs font-black text-white/75">Đúng</p>
                <p className="text-xl font-black text-green-200">
                  {result.correctCount}/6
                </p>
              </div>

              <div className="rounded-2xl border-4 border-red-300 bg-red-500/25 p-2">
                <p className="text-2xl">❌</p>
                <p className="mt-1 text-xs font-black text-white/75">Sai</p>
                <p className="text-xl font-black text-red-200">
                  {result.wrongCount}/6
                </p>
              </div>
            </div>

            {result.isPerfect ? (
              <p className="relative mt-3 rounded-2xl bg-yellow-300/15 px-3 py-2 text-sm font-black text-[var(--game-yellow)]">
                Hoàn hảo! Bạn đã giải mã đúng tiến trình hình thành tư bản tài
                chính.
              </p>
            ) : (
              <p className="relative mt-3 rounded-2xl bg-white/10 px-3 py-2 text-sm font-semibold text-white/80">
                Bạn đã hoàn thành timeline. Tiếp tục sang thử thách tiếp theo
                để bảo vệ chủ quyền kinh tế Việt Nam!
              </p>
            )}

            <button
              type="button"
              onClick={() => onCompleted(result.score)}
              disabled={isSubmitting}
              className="relative mt-4 w-full rounded-[18px] border-4 border-[var(--game-white)] bg-[var(--game-yellow)] py-3 text-base font-black uppercase text-[var(--game-bg-dark)] shadow-[4px_4px_0px_rgba(0,0,0,0.3)] transition hover:-translate-y-1 hover:bg-[var(--game-yellow-hover)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Đang lưu điểm..." : "Sang Stage 2 ➜"}
            </button>
          </div>
        </div>
      )}
    </section>
  )
}