"use client"

import { useMemo, useState } from "react"
import {
  stage3AnswerOptions,
  stage3EvidenceCards,
  type Stage3EvidenceCard,
} from "@/lib/data/stage3Evidence"
import { scoreStage3 } from "@/lib/scoring/scoreStage3"

type StageControllerFinderProps = {
  onCompleted: (score: number) => void
  isSubmitting?: boolean
}

const cardVisuals: Record<string, string> = {
  "fintech-x": "🏦",
  "mekong-retail": "🛒",
  "aurora-bank": "💳",
  "blue-star-tech": "🤖",
  "preferred-share": "📜",
  "silver-lion-fund": "🦁",
  "small-shareholders": "👥",
  "audit-report": "🕵️",
}

const cardHints: Record<string, string> = {
  "fintech-x": "Đối tượng bị chi phối",
  "mekong-retail": "Dữ liệu giao dịch",
  "aurora-bank": "Dòng vốn ngân hàng",
  "blue-star-tech": "Công nghệ đứng sau",
  "preferred-share": "Quyền biểu quyết đặc biệt",
  "silver-lion-fund": "Một mắt xích ẩn trong mạng lưới vốn, công nghệ và cổ đông nhỏ lẻ.",
  "small-shareholders": "Nhóm cổ đông nhỏ",
  "audit-report": "Báo cáo điều tra",
}

function getAnswerIcon(optionLabel: string) {
  const label = optionLabel.toLowerCase()

  if (label.includes("aurora")) return "💳"
  if (label.includes("mekong")) return "🛒"
  if (label.includes("silver lion")) return "🦁"
  if (label.includes("fintech")) return "🏦"
  if (label.includes("blue star")) return "🤖"
  if (label.includes("cổ đông")) return "👥"

  return "🕵️"
}

function getStage3PotentialScore(flippedCount: number) {
  if (flippedCount <= 4) return 100
  if (flippedCount === 5) return 85
  if (flippedCount === 6) return 70
  return 50
}

const guideSteps = [
  "Lật thẻ để lấy manh mối",
  "Đọc gợi ý ngắn bên phải",
  "Chọn chủ thể chi phối thật sự",
]

const confettiItems = ["🎉", "✨", "⭐", "💥", "🎊", "🔥", "🏆", "⚡"]

export default function StageControllerFinder({
  onCompleted,
  isSubmitting = false,
}: StageControllerFinderProps) {
  const [flippedCardIds, setFlippedCardIds] = useState<string[]>([])
  const [activeCardId, setActiveCardId] = useState<string | null>(null)
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null)
  const [warningCard, setWarningCard] = useState<Stage3EvidenceCard | null>(null)
  const [result, setResult] = useState<ReturnType<typeof scoreStage3> | null>(
    null
  )

  const flippedCount = flippedCardIds.length

  const selectedAnswer = useMemo(() => {
    return stage3AnswerOptions.find((option) => option.id === selectedAnswerId)
  }, [selectedAnswerId])

  const activeCard = useMemo(() => {
    return stage3EvidenceCards.find((card) => card.id === activeCardId) ?? null
  }, [activeCardId])

  const revealedCards = useMemo(() => {
    return stage3EvidenceCards.filter((card) => flippedCardIds.includes(card.id))
  }, [flippedCardIds])

  function revealCard(card: Stage3EvidenceCard) {
    setActiveCardId(card.id)

    setFlippedCardIds((current) => {
      if (current.includes(card.id)) return current
      return [...current, card.id]
    })
  }

  function handleFlipCard(card: Stage3EvidenceCard) {
    if (result) return

    const isAlreadyFlipped = flippedCardIds.includes(card.id)

    if (isAlreadyFlipped) {
      setActiveCardId(card.id)
      return
    }

    if (flippedCardIds.length >= 4) {
      setWarningCard(card)
      return
    }

    revealCard(card)
  }

  function handleConfirmFlipWarning() {
    if (!warningCard) return

    revealCard(warningCard)
    setWarningCard(null)
  }

  function handleCancelFlipWarning() {
    setWarningCard(null)
  }

  function handleSubmitAnswer() {
    if (!selectedAnswerId || result) return

    const scoreResult = scoreStage3({
      flippedCount,
      selectedAnswerId,
    })

    setResult(scoreResult)
  }

  function handleContinueNextStage() {
    if (!result) return
    onCompleted(result.score)
  }

  return (
    <section className="stage-enter relative mx-auto max-w-6xl overflow-hidden px-4 py-4 text-[var(--game-white)]">
      <div className="pointer-events-none absolute right-[-120px] top-20 h-64 w-64 rounded-full bg-fuchsia-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-[-80px] h-52 w-52 rounded-full bg-cyan-400/10 blur-3xl" />

      {result?.isCorrect && <FireworkCelebration />}

      {warningCard && !result && (
        <FlipWarningModal
          currentFlippedCount={flippedCount}
          nextFlippedCount={flippedCount + 1}
          nextScore={getStage3PotentialScore(flippedCount + 1)}
          cardTitle={warningCard.title}
          onCancel={handleCancelFlipWarning}
          onConfirm={handleConfirmFlipWarning}
        />
      )}

      {result && (
        <ResultModal
          result={result}
          selectedExplanation={selectedAnswer?.explanation ?? ""}
          isSubmitting={isSubmitting}
          onContinue={handleContinueNextStage}
        />
      )}

      <div className="relative mb-4 text-center">
        <div className="fade-up mx-auto inline-flex items-center gap-2 border-4 border-[var(--game-white)] bg-[var(--game-bg-dark)] px-4 py-1.5 shadow-[4px_4px_0px_rgba(0,0,0,0.3)]">
          <span className="animate-bounce text-xl">🕵️</span>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--game-yellow)]">
            Stage 3
          </p>
          <span className="animate-bounce text-xl [animation-delay:0.2s]">
            🧩
          </span>
        </div>

        <h1 className="fade-up fade-delay-1 mt-3 text-3xl font-black uppercase leading-tight md:text-5xl">
          Mạng Lưới{" "}
          <span className="text-[var(--game-yellow)] drop-shadow-[3px_3px_0px_rgba(0,0,0,0.45)]">
            Chi Phối Ẩn
          </span>
        </h1>

        <div className="fade-up fade-delay-2 mx-auto mt-3 flex max-w-3xl items-center gap-3 rounded-[22px] border-4 border-[var(--game-white)] bg-black/25 p-3 text-left shadow-[5px_5px_0px_rgba(0,0,0,0.25)]">
          <div className="case-float flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-[var(--game-white)] bg-[var(--game-yellow)] text-4xl shadow-[4px_4px_0px_rgba(0,0,0,0.3)]">
            🧑‍💻
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--game-yellow)]">
              Trợ lý điều tra
            </p>
            <p className="mt-1 text-sm font-semibold text-white/85">
              Lật càng ít thẻ càng nhiều điểm. Hãy tìm ai thật sự đứng sau{" "}
              <span className="font-black text-[var(--game-yellow)]">
                Fintech X
              </span>
              .
            </p>
          </div>
        </div>
      </div>

      <div className="case-enter relative grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="fade-up fade-delay-1 relative overflow-hidden rounded-[22px] border-4 border-[var(--game-white)] bg-[linear-gradient(135deg,#221038,#3f1048)] p-4 shadow-[8px_8px_0px_rgba(0,0,0,0.28)]">
          <div className="pointer-events-none absolute -right-8 -top-8 text-8xl opacity-10">
            🃏
          </div>

          <div className="mb-3 flex items-center justify-between gap-3 border-b-4 border-[var(--game-white)] pb-3">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
                <span>🧩</span>
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--game-yellow)]">
                  Bảng bằng chứng
                </p>
              </div>

              <h2 className="mt-1 text-xl font-black">Lật thẻ điều tra</h2>
              <p className="mt-1 text-xs font-bold text-white/70">
                Lật ít thẻ để giữ điểm cao.
              </p>
            </div>

            <div className="relative border-4 border-[var(--game-white)] bg-[var(--game-bg-light)] px-3 py-1.5 text-center shadow-[3px_3px_0px_rgba(0,0,0,0.25)]">
              <span className="absolute -right-2 -top-2 text-xl">⚡</span>
              <p className="text-[10px] font-black uppercase text-white/70">
                Đã lật
              </p>
              <p className="text-xl font-black text-[var(--game-yellow)]">
                {flippedCount}/8
              </p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {stage3EvidenceCards.map((card, index) => (
              <EvidenceFlipCard
                key={card.id}
                card={card}
                index={index}
                isFlipped={flippedCardIds.includes(card.id)}
                isActive={activeCardId === card.id}
                isDisabled={Boolean(result)}
                onFlip={() => handleFlipCard(card)}
              />
            ))}
          </div>

          <div className="mt-3 rounded-[18px] border-4 border-[var(--game-white)] bg-[#3f1048] p-3">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border-4 border-[var(--game-white)] bg-[var(--game-yellow)] text-xl text-[var(--game-bg-dark)]">
                {activeCard ? cardVisuals[activeCard.id] ?? "🕵️" : "🔍"}
              </div>

              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--game-yellow)]">
                  Thẻ đang xem
                </p>
                <p className="truncate text-base font-black">
                  {activeCard ? activeCard.title : "Chưa lật thẻ"}
                </p>
              </div>
            </div>

            {activeCard ? (
              <div className="case-enter grid gap-2">
                <div className="rounded-xl border-2 border-white/20 bg-white/10 px-3 py-2">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-white/60">
                    Gợi ý nhanh
                  </p>
                  <p className="mt-1 text-sm font-black text-[var(--game-yellow)]">
                    {cardHints[activeCard.id] ?? activeCard.note}
                  </p>
                </div>

                <div className="grid gap-2">
                  {activeCard.detailContent.slice(0, 2).map((line) => (
                    <p
                      key={line}
                      className="line-clamp-2 rounded-xl border-l-4 border-[var(--game-yellow)] bg-white/10 px-3 py-2 text-sm font-semibold leading-relaxed text-white/90"
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ) : (
              <p className="rounded-xl border-4 border-dashed border-white/30 bg-white/5 p-3 text-center text-sm font-bold text-white/60">
                Chọn một thẻ để xem manh mối.
              </p>
            )}
          </div>
        </div>

        <div className="fade-up fade-delay-2 grid gap-4">
          <div className="relative overflow-hidden rounded-[22px] border-4 border-[var(--game-white)] bg-[linear-gradient(135deg,#3f1048,#1d102d)] p-4 shadow-[8px_8px_0px_rgba(0,0,0,0.28)]">
            <div className="pointer-events-none absolute -right-8 -top-8 text-8xl opacity-10">
              🧭
            </div>

            <div className="mb-3 border-b-4 border-[var(--game-white)] pb-3 text-center">
              <div className="case-float mx-auto text-4xl">🧑‍⚖️</div>
              <h2 className="mt-1 text-xl font-black">Ai đang chi phối Fintech X?</h2>
              <p className="mt-1 text-xs font-bold text-white/70">
                Chọn nghi phạm chính sau khi xem đủ manh mối.
              </p>
            </div>

            <div className="mb-3 grid gap-2 rounded-[18px] border-4 border-white/30 bg-black/20 p-3">
              {guideSteps.map((step, index) => (
                <div key={step} className="flex items-center gap-2">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--game-yellow)] text-xs font-black text-[var(--game-bg-dark)]">
                    {index + 1}
                  </span>
                  <p className="text-xs font-bold text-white/80">{step}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-2">
              {stage3AnswerOptions.map((option, optionIndex) => {
                const isSelected = selectedAnswerId === option.id
                const showCorrect = result && option.isCorrect
                const showWrong = result && isSelected && !option.isCorrect

                return (
                  <button
                    key={option.id}
                    type="button"
                    disabled={Boolean(result)}
                    onClick={() => setSelectedAnswerId(option.id)}
                    style={{
                      animationDelay: `${0.12 + optionIndex * 0.06}s`,
                    }}
                    className={`fade-up rounded-[18px] border-4 px-3 py-3 text-left text-sm font-black transition ${showCorrect
                      ? "stage-pop border-green-300 bg-green-600/50 text-white"
                      : showWrong
                        ? "stage-shake border-red-300 bg-red-600/50 text-white"
                        : isSelected
                          ? "scale-[1.01] border-[var(--game-yellow)] bg-[var(--game-bg-light)] text-white shadow-[0_0_20px_rgba(250,204,21,0.35)]"
                          : "border-[var(--game-white)] bg-[#3f1048] text-white hover:-translate-y-1 hover:border-[var(--game-yellow)] hover:bg-[var(--game-bg-light)]"
                      } disabled:cursor-not-allowed`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-4 border-[var(--game-white)] bg-[var(--game-yellow)] text-lg text-[var(--game-bg-dark)]">
                        {getAnswerIcon(option.label)}
                      </span>
                      <span>{option.label}</span>
                    </div>
                  </button>
                )
              })}
            </div>

            <button
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswerId || Boolean(result) || isSubmitting}
              className="mt-3 w-full rounded-[18px] border-4 border-[var(--game-white)] bg-[var(--game-yellow)] py-3 text-base font-black uppercase text-[var(--game-bg-dark)] shadow-[4px_4px_0px_rgba(0,0,0,0.25)] transition hover:-translate-y-1 hover:bg-[var(--game-yellow-hover)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {result ? "Đã xác nhận" : "Xác nhận suy luận 🎯"}
            </button>
          </div>

          <div className="relative overflow-hidden rounded-[22px] border-4 border-[var(--game-white)] bg-[linear-gradient(135deg,#221038,#3f1048)] p-4 shadow-[8px_8px_0px_rgba(0,0,0,0.28)]">
            <div className="mb-2 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-black text-[var(--game-yellow)]">
                  Manh mối đã lật
                </h3>
                <p className="text-xs font-bold text-white/60">
                  Bấm lại để xem nhanh.
                </p>
              </div>

              <div className="text-3xl">📌</div>
            </div>

            <div className="grid max-h-[190px] gap-2 overflow-y-auto pr-1">
              {revealedCards.length > 0 ? (
                revealedCards.map((card) => (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => setActiveCardId(card.id)}
                    className={`w-full rounded-[16px] border-4 p-2 text-left transition hover:bg-white/10 ${activeCardId === card.id
                      ? "border-[var(--game-yellow)] bg-white/10"
                      : "border-white/30 bg-[#3f1048]"
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/25 text-2xl">
                        {cardVisuals[card.id] ?? "🕵️"}
                      </span>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-black">
                          {card.code}. {card.title}
                        </p>
                        <p className="truncate text-xs font-semibold text-white/65">
                          {cardHints[card.id] ?? card.note}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <p className="rounded-[16px] border-4 border-dashed border-white/40 p-4 text-center text-sm font-bold text-white/60">
                  Chưa có manh mối nào.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function EvidenceFlipCard({
  card,
  index,
  isFlipped,
  isActive,
  isDisabled,
  onFlip,
}: {
  card: Stage3EvidenceCard
  index: number
  isFlipped: boolean
  isActive: boolean
  isDisabled: boolean
  onFlip: () => void
}) {
  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={onFlip}
      style={{
        animationDelay: `${0.08 + index * 0.04}s`,
        perspective: "1000px",
      }}
      className="fade-up h-[126px] text-left disabled:cursor-not-allowed"
    >
      <div
        className={`relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] ${isFlipped ? "[transform:rotateY(180deg)]" : ""
          }`}
      >
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center rounded-[18px] border-4 p-2 shadow-[3px_3px_0px_rgba(0,0,0,0.25)] [backface-visibility:hidden] ${isActive
            ? "border-[var(--game-yellow)] bg-[var(--game-bg-light)]"
            : "border-[var(--game-white)] bg-[#3f1048]"
            }`}
        >
          <div className="text-4xl">🂠</div>
          <p className="mt-1 text-2xl font-black text-[var(--game-yellow)]">
            {card.code}
          </p>
          <p className="mt-1 text-center text-[9px] font-black uppercase tracking-[0.14em] text-white/60">
            Bằng chứng
          </p>
        </div>

        <div
          className={`absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-[18px] border-4 bg-[var(--game-bg-light)] p-2 text-center shadow-[3px_3px_0px_rgba(0,0,0,0.25)] [backface-visibility:hidden] [transform:rotateY(180deg)] ${isActive ? "border-[var(--game-yellow)]" : "border-[var(--game-white)]"
            }`}
        >
          <p className="absolute left-2 top-2 text-[9px] font-black text-[var(--game-yellow)]">
            {card.code}
          </p>

          <div className="case-float text-4xl">
            {cardVisuals[card.id] ?? "🕵️"}
          </div>

          <h3 className="mt-2 line-clamp-2 text-sm font-black leading-tight">
            {card.title}
          </h3>
        </div>
      </div>
    </button>
  )
}

function ResultModal({
  result,
  selectedExplanation,
  isSubmitting,
  onContinue,
}: {
  result: ReturnType<typeof scoreStage3>
  selectedExplanation: string
  isSubmitting: boolean
  onContinue: () => void
}) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center overflow-hidden bg-black/70 px-4 backdrop-blur-sm">
      {result.isCorrect &&
        confettiItems.map((item, index) => (
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

      <div
        className={`case-enter relative w-full max-w-[560px] overflow-hidden rounded-[28px] border-4 p-5 text-center shadow-[10px_10px_0px_rgba(0,0,0,0.4)] ${result.isCorrect
          ? "border-green-300 bg-[linear-gradient(135deg,#245543,#1b102b)]"
          : "border-red-300 bg-[linear-gradient(135deg,#5a1f35,#1b102b)]"
          }`}
      >
        <div className="pointer-events-none absolute -right-8 -top-8 text-8xl opacity-10">
          {result.isCorrect ? "🏆" : "❌"}
        </div>

        <div className="relative mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full border-4 border-[var(--game-white)] bg-[var(--game-yellow)] text-5xl shadow-[5px_5px_0px_rgba(0,0,0,0.35)]">
          {result.isCorrect ? "🏆" : "📊"}
          <span className="absolute -right-3 -top-2 animate-ping text-2xl">
            ✨
          </span>
        </div>

        <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--game-yellow)]">
          Hoàn thành Stage 3
        </p>

        <h2 className="mt-2 text-2xl font-black uppercase leading-tight md:text-3xl">
          {result.isCorrect ? "Suy luận chính xác!" : "Suy luận chưa đúng"}
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

        <p className="mt-3 text-sm font-bold text-white/80">
          Bạn đã lật {result.flippedCount}/8 thẻ.
        </p>

        <div className="mt-3 rounded-2xl border-4 border-white/30 bg-black/20 p-3 text-left">
          <p className="text-sm font-black text-[var(--game-yellow)]">
            Gợi ý đáp án:
          </p>

          <p className="mt-1 text-sm font-semibold leading-relaxed text-white/90">
            {selectedExplanation}
          </p>
        </div>

        {result.isCorrect && (
          <div className="mt-3 rounded-2xl border-4 border-[var(--game-white)] bg-white/10 p-3 text-left">
            <p className="text-sm font-black text-[var(--game-yellow)]">
              Chuỗi suy luận đúng:
            </p>

            <p className="mt-1 text-sm font-semibold leading-relaxed text-white/90">
              Silver Lion Fund đứng sau thông qua vốn, công nghệ, dữ liệu và
              quyền biểu quyết.
            </p>
          </div>
        )}

        <button
          onClick={onContinue}
          disabled={isSubmitting}
          className="mt-4 w-full rounded-[18px] border-4 border-[var(--game-white)] bg-[var(--game-yellow)] py-3 text-base font-black uppercase text-[var(--game-bg-dark)] shadow-[4px_4px_0px_rgba(0,0,0,0.25)] transition hover:-translate-y-1 hover:bg-[var(--game-yellow-hover)] disabled:cursor-wait disabled:opacity-60"
        >
          {isSubmitting ? "Đang lưu điểm..." : "Sang Stage 4 ➜"}
        </button>
      </div>
    </div>
  )
}

function FireworkCelebration() {
  const particles = Array.from({ length: 28 }, (_, index) => index)

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {particles.map((particle) => {
        const left = 10 + ((particle * 23) % 80)
        const delay = (particle % 9) * 0.08
        const size = 7 + (particle % 4) * 3

        return (
          <span
            key={particle}
            className="firework-particle absolute rounded-full bg-[var(--game-yellow)]"
            style={{
              left: `${left}%`,
              top: particle % 2 === 0 ? "35%" : "48%",
              width: `${size}px`,
              height: `${size}px`,
              animationDelay: `${delay}s`,
            }}
          />
        )
      })}
    </div>
  )
}

function FlipWarningModal({
  currentFlippedCount,
  nextFlippedCount,
  nextScore,
  cardTitle,
  onCancel,
  onConfirm,
}: {
  currentFlippedCount: number
  nextFlippedCount: number
  nextScore: number
  cardTitle: string
  onCancel: () => void
  onConfirm: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="case-enter relative w-full max-w-[520px] overflow-hidden rounded-[28px] border-4 border-[var(--game-white)] bg-[linear-gradient(135deg,#5a1f35,#1b102b)] p-5 text-center shadow-[10px_10px_0px_rgba(0,0,0,0.4)]">
        <div className="pointer-events-none absolute -right-8 -top-8 text-8xl opacity-10">
          ⚠️
        </div>

        <div className="relative mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full border-4 border-[var(--game-white)] bg-[var(--game-yellow)] text-5xl shadow-[5px_5px_0px_rgba(0,0,0,0.35)]">
          ⚠️
        </div>

        <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--game-yellow)]">
          Cảnh báo điểm Stage 3
        </p>

        <h2 className="mt-2 text-2xl font-black uppercase leading-tight">
          Bạn sắp lật quá 4 thẻ
        </h2>

        <div className="mt-4 rounded-[22px] border-4 border-[var(--game-white)] bg-black/25 p-4">
          <p className="text-sm font-bold text-white/80">
            Bạn đã lật{" "}
            <span className="font-black text-[var(--game-yellow)]">
              {currentFlippedCount}/8
            </span>{" "}
            thẻ.
          </p>

          <p className="mt-2 text-sm font-bold text-white/80">
            Nếu lật tiếp thẻ:
          </p>

          <p className="mt-1 text-xl font-black text-[var(--game-yellow)]">
            {cardTitle}
          </p>

          <p className="mt-3 text-sm font-bold text-white/80">
            Số thẻ đã lật sẽ thành{" "}
            <span className="font-black text-[var(--game-yellow)]">
              {nextFlippedCount}/8
            </span>
            .
          </p>
        </div>

        <div className="mt-4 rounded-[22px] border-4 border-[var(--game-white)] bg-[var(--game-bg-light)] p-4">
          <p className="text-sm font-black text-white/80">
            Nếu trả lời đúng, điểm tối đa còn:
          </p>

          <p className="mt-1 text-6xl font-black text-[var(--game-yellow)] drop-shadow-[3px_3px_0px_rgba(0,0,0,0.35)]">
            {nextScore}
          </p>

          <p className="text-sm font-bold text-white/70">điểm</p>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-[18px] border-4 border-[var(--game-white)] bg-[#3f1048] py-3 text-base font-black uppercase text-white shadow-[4px_4px_0px_rgba(0,0,0,0.25)] transition hover:-translate-y-1 hover:bg-[var(--game-bg-light)]"
          >
            Không lật nữa
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="rounded-[18px] border-4 border-[var(--game-white)] bg-[var(--game-yellow)] py-3 text-base font-black uppercase text-[var(--game-bg-dark)] shadow-[4px_4px_0px_rgba(0,0,0,0.25)] transition hover:-translate-y-1 hover:bg-[var(--game-yellow-hover)]"
          >
            Vẫn lật tiếp
          </button>
        </div>
      </div>
    </div>
  )
}