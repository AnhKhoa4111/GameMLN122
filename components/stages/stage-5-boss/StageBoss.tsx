"use client"

import { useEffect, useMemo, useState } from "react"
import Button from "@/components/ui/Button"
import {
  STAGE5_PERFECT_SCORE,
  STAGE5_POINTS_PER_CORRECT_CARD,
  STAGE5_REQUIRED_SELECTION_COUNT,
  stage5PolicyCards,
} from "@/lib/data/stage5Policies"
import { scoreStage5 } from "@/lib/scoring/scoreStage5"

type StageBossProps = {
  onCompleted: (score: number) => void
  isSubmitting?: boolean
}

export default function StageBoss({ onCompleted, isSubmitting = false }: StageBossProps) {
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([])
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [revealedCount, setRevealedCount] = useState(0)

  const selectedCards = useMemo(
    () => stage5PolicyCards.filter((card) => selectedCardIds.includes(card.id)),
    [selectedCardIds]
  )
  const result = useMemo(() => scoreStage5(selectedCardIds), [selectedCardIds])
  const canConfirm = selectedCardIds.length === STAGE5_REQUIRED_SELECTION_COUNT && !isConfirmed
  const hasRevealedAll = isConfirmed && revealedCount >= selectedCards.length

  useEffect(() => {
    if (!isConfirmed || revealedCount >= selectedCards.length) return

    const timer = window.setTimeout(() => {
      setRevealedCount((currentCount) => currentCount + 1)
    }, 650)

    return () => window.clearTimeout(timer)
  }, [isConfirmed, revealedCount, selectedCards.length])

  function toggleCard(cardId: string) {
    if (isConfirmed) return

    setSelectedCardIds((currentIds) => {
      if (currentIds.includes(cardId)) {
        return currentIds.filter((id) => id !== cardId)
      }

      if (currentIds.length >= STAGE5_REQUIRED_SELECTION_COUNT) {
        return currentIds
      }

      return [...currentIds, cardId]
    })
  }

  function confirmSelection() {
    if (!canConfirm) return
    setIsConfirmed(true)
    setRevealedCount(0)
  }

  return (
    <section className="mt-8">
      <div className="border-4 border-[var(--game-white)] bg-[var(--game-bg-dark)] p-5 shadow-[8px_8px_0px_rgba(0,0,0,0.25)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--game-yellow)]">
              Phòng 5 - Boss Room
            </p>
            <h2 className="mt-2 text-3xl font-black">Phòng Quyết Định Quốc Gia</h2>
            <p className="mt-2 max-w-2xl text-sm font-bold text-white/75">
              Chọn đúng 4 lá chính sách để cân bằng hội nhập và bảo vệ chủ quyền kinh tế.
            </p>
          </div>

          <div className="border-4 border-[var(--game-white)] bg-[var(--game-yellow)] px-4 py-2 text-center font-black text-[var(--game-bg-dark)]">
            {selectedCardIds.length}/{STAGE5_REQUIRED_SELECTION_COUNT} lá
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <RuleCard title="Luật chơi" value="Chỉ chọn 4 lá. Xác nhận xong là khóa đáp án." />
          <RuleCard title="Điểm" value={`Mỗi lá đúng +${STAGE5_POINTS_PER_CORRECT_CARD} điểm.`} />
          <RuleCard title="Perfect" value={`Đúng cả 4 lá được x2 thành ${STAGE5_PERFECT_SCORE} điểm.`} />
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stage5PolicyCards.map((card) => {
            const isSelected = selectedCardIds.includes(card.id)
            const isRevealed = isConfirmed && selectedCards.slice(0, revealedCount).some(
              (selectedCard) => selectedCard.id === card.id
            )

            return (
              <button
                key={card.id}
                type="button"
                onClick={() => toggleCard(card.id)}
                disabled={isConfirmed}
                className={`min-h-[150px] border-4 p-4 text-left transition ${
                  isRevealed
                    ? card.isCorrect
                      ? "border-green-200 bg-green-600/50"
                      : "border-red-200 bg-red-600/50"
                    : isSelected
                      ? "border-[var(--game-yellow)] bg-[#3f1048]"
                      : "border-[var(--game-white)] bg-[var(--game-bg-light)] hover:bg-[var(--game-bg-focus)]"
                } disabled:cursor-default`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xl font-black">{isSelected ? "■" : "□"}</span>
                  <span className="border-2 border-white/70 px-2 py-1 text-xs font-black text-white/80">
                    {card.tag}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-black leading-tight">{card.title}</h3>

                {isRevealed && (
                  <div className="mt-3">
                    <p className="font-black text-[var(--game-yellow)]">
                      {card.isCorrect ? `+${STAGE5_POINTS_PER_CORRECT_CARD}` : "+0"}
                    </p>
                    <p className="mt-1 text-xs font-bold text-white/80">{card.reason}</p>
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {!isConfirmed ? (
          <Button
            type="button"
            onClick={confirmSelection}
            disabled={!canConfirm}
            className="mt-6 w-full"
          >
            Xác nhận chiến lược
          </Button>
        ) : (
          <div className="mt-6 border-4 border-[var(--game-white)] bg-[var(--game-bg-light)] p-5 text-center">
            <p className="text-2xl font-black">
              {hasRevealedAll ? (
                <>
                  Điểm Boss Room:{" "}
                  <span className="text-[var(--game-yellow)]">{result.score}</span>
                </>
              ) : (
                "Đang lật từng lá..."
              )}
            </p>

            {hasRevealedAll && (
              <>
                <p className="mt-2 font-bold text-white/80">
                  Đúng {result.correctCount}/4 lá
                  {result.isPerfect ? " - Perfect x2!" : ""}
                </p>
                <p className="mt-3 text-xl font-black text-[var(--game-yellow)]">
                  VIỆT NAM ĐÃ ĐƯỢC BẢO VỆ
                </p>
                <Button
                  type="button"
                  onClick={() => onCompleted(result.score)}
                  disabled={isSubmitting}
                  className="mt-4 w-full"
                >
                  {isSubmitting ? "Đang lưu..." : "Hoàn tất game"}
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

function RuleCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="border-4 border-[var(--game-white)] bg-[#3f1048] p-4">
      <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--game-yellow)]">
        {title}
      </p>
      <p className="mt-2 text-sm font-bold text-white/80">{value}</p>
    </div>
  )
}
