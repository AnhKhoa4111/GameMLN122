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

export default function StageControllerFinder({
  onCompleted,
  isSubmitting = false,
}: StageControllerFinderProps) {
  const [flippedCardIds, setFlippedCardIds] = useState<string[]>([])
  const [activeCardId, setActiveCardId] = useState<string | null>(null)
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null)
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

  function handleFlipCard(card: Stage3EvidenceCard) {
    if (result) return

    setActiveCardId(card.id)

    setFlippedCardIds((current) => {
      if (current.includes(card.id)) return current
      return [...current, card.id]
    })
  }

  function handleSubmitAnswer() {
    if (!selectedAnswerId || result) return

    const scoreResult = scoreStage3({
      flippedCount,
      selectedAnswerId,
    })

    setResult(scoreResult)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function handleContinueNextStage() {
    if (!result) return
    onCompleted(result.score)
  }

  return (
    <section className="stage-enter mx-auto max-w-7xl px-4 py-8 text-[var(--game-white)]">
      {result?.isCorrect && <FireworkCelebration />}

      {result && (
        <ResultModal
          result={result}
          selectedExplanation={selectedAnswer?.explanation ?? ""}
          isSubmitting={isSubmitting}
          onContinue={handleContinueNextStage}
        />
      )}

      <div className="mb-8 text-center">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-[var(--game-yellow)]">
          Stage 3
        </p>

        <h1 className="mt-3 text-4xl font-black uppercase md:text-5xl">
          Mạng Lưới Chi Phối Ẩn
        </h1>

        <p className="mx-auto mt-4 max-w-4xl text-base font-semibold text-white/80">
          Fintech X nắm ví điện tử, dữ liệu giao dịch, điểm tín dụng và dịch vụ
          cho vay tiêu dùng. Hãy lật bằng chứng để tìm ra chủ thể thật sự chi
          phối phía sau.
        </p>
      </div>

      <div className="case-enter grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="fade-up fade-delay-1 bg-[var(--game-bg-dark)] p-5 shadow-[8px_8px_0px_rgba(0,0,0,0.25)]">
          <div className="mb-5 flex flex-col gap-3 border-b-4 border-[var(--game-white)] pb-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-black">Bảng bằng chứng</h2>
              <p className="mt-1 font-semibold text-white/70">
                Lật càng ít thẻ, điểm càng cao. Nội dung chi tiết sẽ hiện ở
                khung bên dưới.
              </p>
            </div>

            <div className="border-4 border-[var(--game-white)] bg-[var(--game-bg-light)] px-5 py-3 text-center">
              <p className="text-xs font-black uppercase text-white/70">
                Đã lật
              </p>
              <p className="text-2xl font-black text-[var(--game-yellow)]">
                {flippedCount}/8
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {stage3EvidenceCards.map((card, index) => (
              <EvidenceFlipCard
                key={card.id}
                card={card}
                index={index}
                isFlipped={flippedCardIds.includes(card.id)}
                isDisabled={Boolean(result)}
                onFlip={() => handleFlipCard(card)}
              />
            ))}
          </div>

          <div className="mt-6 border-4 border-[var(--game-white)] bg-[#3f1048] p-5">
            <h3 className="text-xl font-black text-[var(--game-yellow)]">
              Chi tiết thẻ đang xem
            </h3>

            {activeCard ? (
              <div className="case-enter mt-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center border-4 border-[var(--game-white)] bg-[var(--game-bg-light)] text-4xl">
                    {cardVisuals[activeCard.id] ?? "🕵️"}
                  </div>

                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.16em] text-white/60">
                      Thẻ {activeCard.code}
                    </p>
                    <p className="text-2xl font-black">{activeCard.title}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {activeCard.detailContent.map((line) => (
                    <p
                      key={line}
                      className="border-l-4 border-[var(--game-yellow)] bg-white/10 px-3 py-2 font-semibold leading-relaxed text-white/90"
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ) : (
              <p className="mt-4 font-bold text-white/60">
                Hãy lật một thẻ để xem chi tiết.
              </p>
            )}
          </div>
        </div>

        <div className="fade-up fade-delay-2 space-y-6">
          <div className="bg-[var(--game-bg-dark)] p-5 shadow-[8px_8px_0px_rgba(0,0,0,0.25)]">
            <h2 className="text-center text-2xl font-black">Câu hỏi cuối</h2>

            <p className="mt-4 text-center text-lg font-bold text-white/80">
              Chủ thể nào đang thực sự chi phối Fintech X?
            </p>

            <div className="mt-5 grid gap-3">
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
                      animationDelay: `${0.18 + optionIndex * 0.08}s`,
                    }}
                    className={`fade-up border-4 px-4 py-4 text-left text-lg font-black transition ${
                      showCorrect
                        ? "border-green-300 bg-green-600/50 text-white"
                        : showWrong
                          ? "border-red-300 bg-red-600/50 text-white"
                          : isSelected
                            ? "border-[var(--game-yellow)] bg-[var(--game-bg-light)] text-white shadow-[0_0_20px_rgba(250,204,21,0.35)]"
                            : "border-[var(--game-white)] bg-[#3f1048] text-white hover:bg-[var(--game-bg-light)]"
                    } disabled:cursor-not-allowed`}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>

            <button
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswerId || Boolean(result) || isSubmitting}
              className="mt-5 w-full border-4 border-[var(--game-white)] bg-[var(--game-yellow)] py-3 text-lg font-black text-[var(--game-bg-dark)] shadow-[4px_4px_0px_rgba(0,0,0,0.25)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {result ? "Đã xác nhận" : "Xác nhận chủ thể chi phối"}
            </button>
          </div>

          <div className="bg-[var(--game-bg-dark)] p-5 shadow-[8px_8px_0px_rgba(0,0,0,0.25)]">
            <h3 className="text-xl font-black text-[var(--game-yellow)]">
              Bảng ghi chú điều tra
            </h3>

            <div className="mt-4 max-h-[360px] space-y-3 overflow-y-auto pr-2">
              {revealedCards.length > 0 ? (
                revealedCards.map((card) => (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => setActiveCardId(card.id)}
                    className={`w-full border-4 p-3 text-left transition hover:bg-white/10 ${
                      activeCardId === card.id
                        ? "border-white bg-white/10"
                        : "border-white/30 bg-[#3f1048]"
                    }`}
                  >
                    <p className="font-black">
                      {card.code}. {card.title}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white/75">
                      {card.note}
                    </p>
                  </button>
                ))
              ) : (
                <p className="border-4 border-dashed border-white/40 p-4 text-center font-bold text-white/60">
                  Chưa có bằng chứng nào được lật.
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
  isDisabled,
  onFlip,
}: {
  card: Stage3EvidenceCard
  index: number
  isFlipped: boolean
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
      className="fade-up h-[220px] text-left disabled:cursor-not-allowed"
    >
      <div
        className={`relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] ${
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center border-4 border-[var(--game-white)] bg-[#3f1048] p-4 shadow-[4px_4px_0px_rgba(0,0,0,0.25)] [backface-visibility:hidden]">
          <div className="text-6xl">🂠</div>
          <p className="mt-4 text-4xl font-black text-[var(--game-yellow)]">
            {card.code}
          </p>
          <p className="mt-2 text-center text-xs font-black uppercase tracking-[0.16em] text-white/60">
            Bằng chứng mật
          </p>
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden border-4 border-[var(--game-white)] bg-[var(--game-bg-light)] p-4 text-center shadow-[4px_4px_0px_rgba(0,0,0,0.25)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <p className="absolute left-3 top-3 text-xs font-black text-[var(--game-yellow)]">
            THẺ {card.code}
          </p>

          <div className="animate-bounce text-6xl">
            {cardVisuals[card.id] ?? "🕵️"}
          </div>

          <h3 className="mt-4 text-xl font-black leading-tight">
            {card.title}
          </h3>

          <p className="mt-3 text-xs font-black uppercase tracking-[0.14em] text-white/65">
            Xem chi tiết bên dưới
          </p>
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
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div
        className={`case-enter w-full max-w-3xl border-4 p-6 text-center shadow-[10px_10px_0px_rgba(0,0,0,0.35)] ${
          result.isCorrect
            ? "border-green-300 bg-[#3f1048]"
            : "border-red-300 bg-[#3f1048]"
        }`}
      >
        <h2 className="text-3xl font-black">
          {result.isCorrect ? "🎉 SUY LUẬN CHÍNH XÁC!" : "✘ SUY LUẬN SAI"}
        </h2>

        <p className="mt-3 text-2xl font-black text-[var(--game-yellow)]">
          Điểm Stage 3: {result.score}
        </p>

        <p className="mt-2 font-bold text-white/80">
          Bạn đã lật {result.flippedCount}/8 thẻ.
        </p>

        <p className="mx-auto mt-4 max-w-2xl text-left font-semibold leading-relaxed text-white/90">
          {selectedExplanation}
        </p>

        {result.isCorrect && (
          <div className="mt-5 border-4 border-[var(--game-white)] bg-white/10 p-4 text-left">
            <p className="font-black text-[var(--game-yellow)]">
              Chuỗi suy luận đúng:
            </p>

            <p className="mt-2 font-semibold leading-relaxed text-white/90">
              Silver Lion Fund liên quan đến Blue Star Tech, cổ phần ưu đãi,
              nhóm cố vấn đầu tư và một phần cổ đông nhỏ lẻ. Vì vậy Fintech X
              bị chi phối thông qua vốn, công nghệ, dữ liệu và quyền biểu
              quyết, chứ không chỉ qua tỷ lệ cổ phần công khai.
            </p>
          </div>
        )}

        <button
          onClick={onContinue}
          disabled={isSubmitting}
          className="mt-6 w-full border-4 border-[var(--game-white)] bg-[var(--game-yellow)] py-3 text-lg font-black text-[var(--game-bg-dark)] shadow-[4px_4px_0px_rgba(0,0,0,0.25)] disabled:cursor-wait disabled:opacity-60"
        >
          {isSubmitting ? "Đang lưu điểm..." : "Sang Stage 4"}
        </button>
      </div>
    </div>
  )
}

function FireworkCelebration() {
  const particles = Array.from({ length: 36 }, (_, index) => index)

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {particles.map((particle) => {
        const left = 10 + ((particle * 23) % 80)
        const delay = (particle % 9) * 0.08
        const size = 8 + (particle % 4) * 3

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