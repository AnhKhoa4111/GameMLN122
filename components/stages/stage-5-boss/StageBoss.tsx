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
  onCompleted: (score: number) => void | Promise<void>
  isSubmitting?: boolean
}

const policyVisuals: Record<
  string,
  {
    icon: string
    character: string
    role: string
  }
> = {
  "attract-fdi": {
    icon: "🌏",
    character: "🧑‍💼",
    role: "Mở cửa thông minh",
  },
  "develop-vietnamese-business": {
    icon: "🇻🇳",
    character: "👷",
    role: "Nội lực quốc gia",
  },
  "full-opening": {
    icon: "🚪",
    character: "🤑",
    role: "Rủi ro mất kiểm soát",
  },
  "anti-monopoly": {
    icon: "🛡️",
    character: "🧑‍⚖️",
    role: "Giữ cạnh tranh",
  },
  "control-fintech": {
    icon: "📱",
    character: "🤖",
    role: "Kiểm soát nền tảng",
  },
  "protect-data": {
    icon: "🔐",
    character: "🧑‍💻",
    role: "Chủ quyền số",
  },
  "foreign-capital-dependence": {
    icon: "⛓️",
    character: "🦹",
    role: "Bẫy phụ thuộc",
  },
  "stock-transparency": {
    icon: "📊",
    character: "🕵️",
    role: "Minh bạch thị trường",
  },
}

const confettiItems = ["🎉", "✨", "⭐", "💥", "🎊", "🔥", "🏆", "⚡"]

export default function StageBoss({
  onCompleted,
  isSubmitting = false,
}: StageBossProps) {
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([])
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [revealedCount, setRevealedCount] = useState(0)
  const [isFinishLocked, setIsFinishLocked] = useState(false)

  const selectedCards = useMemo(
    () => stage5PolicyCards.filter((card) => selectedCardIds.includes(card.id)),
    [selectedCardIds]
  )

  const result = useMemo(() => scoreStage5(selectedCardIds), [selectedCardIds])

  const canConfirm =
    selectedCardIds.length === STAGE5_REQUIRED_SELECTION_COUNT && !isConfirmed

  const hasRevealedAll =
    isConfirmed && revealedCount >= selectedCards.length

  useEffect(() => {
    if (!isConfirmed || revealedCount >= selectedCards.length) return

    const timer = window.setTimeout(() => {
      setRevealedCount((currentCount) => currentCount + 1)
    }, 450)

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

  async function handleFinishGame() {
    if (!hasRevealedAll || isSubmitting || isFinishLocked) return

    setIsFinishLocked(true)

    try {
      await onCompleted(result.score)
    } finally {
      window.setTimeout(() => {
        setIsFinishLocked(false)
      }, 1500)
    }
  }

  return (
    <section className="stage-enter relative mx-auto max-w-6xl overflow-hidden px-4 py-4 text-[var(--game-white)]">
      <div className="pointer-events-none absolute right-[-120px] top-24 h-64 w-64 rounded-full bg-fuchsia-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-[-80px] h-52 w-52 rounded-full bg-cyan-400/10 blur-3xl" />

      {hasRevealedAll && (
        <BossResultModal
          result={result}
          isSubmitting={isSubmitting || isFinishLocked}
          onFinish={handleFinishGame}
        />
      )}

      <div className="relative mb-4 text-center">
        <div className="fade-up mx-auto inline-flex items-center gap-2 border-4 border-[var(--game-white)] bg-[var(--game-bg-dark)] px-4 py-1.5 shadow-[4px_4px_0px_rgba(0,0,0,0.3)]">
          <span className="animate-bounce text-xl">🇻🇳</span>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--game-yellow)]">
            Stage 5 - Boss Room
          </p>
          <span className="animate-bounce text-xl [animation-delay:0.2s]">
            🏛️
          </span>
        </div>

        <h1 className="fade-up fade-delay-1 mt-3 text-3xl font-black uppercase leading-tight md:text-5xl">
          Phòng Quyết Định{" "}
          <span className="text-[var(--game-yellow)] drop-shadow-[3px_3px_0px_rgba(0,0,0,0.45)]">
            Quốc Gia
          </span>
        </h1>

        <div className="fade-up fade-delay-2 mx-auto mt-3 flex max-w-3xl items-center gap-3 rounded-[22px] border-4 border-[var(--game-white)] bg-black/25 p-3 text-left shadow-[5px_5px_0px_rgba(0,0,0,0.25)]">
          <div className="case-float flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-[var(--game-white)] bg-[var(--game-yellow)] text-4xl shadow-[4px_4px_0px_rgba(0,0,0,0.3)]">
            🧑‍⚖️
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--game-yellow)]">
              Hội đồng bảo vệ kinh tế
            </p>
            <p className="mt-1 text-sm font-semibold text-white/85">
              Chọn đúng{" "}
              <span className="font-black text-[var(--game-yellow)]">
                4 chính sách
              </span>{" "}
              để cân bằng hội nhập và bảo vệ chủ quyền kinh tế Việt Nam.
            </p>
          </div>
        </div>
      </div>

      <div className="case-enter rounded-[24px] border-4 border-[var(--game-white)] bg-[linear-gradient(135deg,#221038,#3f1048)] p-4 shadow-[8px_8px_0px_rgba(0,0,0,0.28)]">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b-4 border-[var(--game-white)] pb-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--game-yellow)]">
              Boss Mission
            </p>
            <h2 className="mt-1 text-2xl font-black">
              Chọn bộ chính sách bảo vệ Việt Nam
            </h2>
          </div>

          <div className="relative border-4 border-[var(--game-white)] bg-[var(--game-yellow)] px-4 py-2 text-center font-black text-[var(--game-bg-dark)] shadow-[3px_3px_0px_rgba(0,0,0,0.25)]">
            <span className="absolute -right-2 -top-2 text-xl">⚡</span>
            {selectedCardIds.length}/{STAGE5_REQUIRED_SELECTION_COUNT} lá
          </div>
        </div>

        <div className="mb-4 grid gap-3 md:grid-cols-3">
          <RuleCard
            icon="🎯"
            title="Luật chơi"
            value="Chỉ chọn 4 lá. Trước khi xác nhận vẫn có thể đổi."
          />
          <RuleCard
            icon="⭐"
            title="Điểm"
            value={`Mỗi lá đúng +${STAGE5_POINTS_PER_CORRECT_CARD} điểm.`}
          />
          <RuleCard
            icon="🏆"
            title="Perfect"
            value={`Đúng cả 4 lá được x2 thành ${STAGE5_PERFECT_SCORE} điểm.`}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stage5PolicyCards.map((card, index) => {
            const isSelected = selectedCardIds.includes(card.id)
            const isRevealed =
              isConfirmed &&
              selectedCards
                .slice(0, revealedCount)
                .some((selectedCard) => selectedCard.id === card.id)

            const visual = policyVisuals[card.id] ?? {
              icon: "📌",
              character: "🧑‍💼",
              role: card.tag,
            }

            return (
              <button
                key={card.id}
                type="button"
                onClick={() => toggleCard(card.id)}
                disabled={isConfirmed}
                style={{
                  animationDelay: `${0.08 + index * 0.05}s`,
                }}
                className={`fade-up relative min-h-[145px] overflow-hidden rounded-[20px] border-4 p-3 text-left transition ${isRevealed
                  ? card.isCorrect
                    ? "stage-pop border-green-200 bg-green-600/50"
                    : "stage-shake border-red-200 bg-red-600/50"
                  : isSelected
                    ? "scale-[1.02] border-[var(--game-yellow)] bg-[#3f1048] shadow-[0_0_22px_rgba(250,204,21,0.35)]"
                    : "border-[var(--game-white)] bg-[var(--game-bg-light)] hover:-translate-y-1 hover:border-[var(--game-yellow)] hover:bg-[var(--game-bg-focus)]"
                  } disabled:cursor-default`}
              >
                <div className="pointer-events-none absolute -right-4 -top-4 text-6xl opacity-10">
                  {visual.icon}
                </div>

                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl border-4 border-[var(--game-white)] bg-[var(--game-yellow)] text-lg font-black text-[var(--game-bg-dark)]">
                    {isSelected ? "✓" : "+"}
                  </span>

                  <span className="rounded-lg border-2 border-white/70 bg-black/20 px-2 py-1 text-[10px] font-black uppercase text-white/80">
                    {visual.role}
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-3">
                  <div className="case-float flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-4 border-[var(--game-white)] bg-[#3f1048] text-3xl">
                    {visual.character}
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--game-yellow)]">
                      {card.tag}
                    </p>
                    <h3 className="line-clamp-2 text-base font-black leading-tight">
                      {card.title}
                    </h3>
                  </div>
                </div>

                {isRevealed && (
                  <div className="mt-3 rounded-xl border-2 border-white/40 bg-black/20 p-2">
                    <p className="font-black text-[var(--game-yellow)]">
                      {card.isCorrect
                        ? `+${STAGE5_POINTS_PER_CORRECT_CARD}`
                        : "+0"}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs font-bold text-white/80">
                      {card.reason}
                    </p>
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
            className="mt-4 w-full"
          >
            Xác nhận chiến lược
          </Button>
        ) : !hasRevealedAll ? (
          <div className="stage-pop mt-4 rounded-[20px] border-4 border-[var(--game-white)] bg-white/10 p-4 text-center">
            <p className="animate-pulse text-xl font-black text-[var(--game-yellow)]">
              Đang kiểm tra từng chính sách...
            </p>
          </div>
        ) : null}
      </div>
    </section>
  )
}

function RuleCard({
  icon,
  title,
  value,
}: {
  icon: string
  title: string
  value: string
}) {
  return (
    <div className="rounded-[18px] border-4 border-[var(--game-white)] bg-[#3f1048] p-3 shadow-[3px_3px_0px_rgba(0,0,0,0.2)]">
      <div className="mb-1 flex items-center gap-2">
        <span className="text-2xl">{icon}</span>
        <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--game-yellow)]">
          {title}
        </p>
      </div>
      <p className="text-sm font-bold text-white/80">{value}</p>
    </div>
  )
}

function BossResultModal({
  result,
  isSubmitting,
  onFinish,
}: {
  result: ReturnType<typeof scoreStage5>
  isSubmitting: boolean
  onFinish: () => void
}) {
  return (
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

      <div className="case-enter relative w-full max-w-[540px] overflow-hidden rounded-[28px] border-4 border-[var(--game-white)] bg-[linear-gradient(135deg,#3f1048,#1b102b)] p-5 text-center shadow-[10px_10px_0px_rgba(0,0,0,0.4)]">
        <div className="pointer-events-none absolute -right-8 -top-8 text-8xl opacity-10">
          🇻🇳
        </div>

        <div className="relative mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full border-4 border-[var(--game-white)] bg-[var(--game-yellow)] text-5xl shadow-[5px_5px_0px_rgba(0,0,0,0.35)]">
          {result.isPerfect ? "🏆" : "📊"}
          <span className="absolute -right-3 -top-2 animate-ping text-2xl">
            ✨
          </span>
        </div>

        <p className="relative text-xs font-black uppercase tracking-[0.22em] text-[var(--game-yellow)]">
          Boss Room Complete
        </p>

        <h2 className="relative mt-2 text-2xl font-black uppercase leading-tight text-[var(--game-white)] md:text-3xl">
          Việt Nam đã được bảo vệ
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
              {result.correctCount}/4
            </p>
          </div>

          <div className="rounded-2xl border-4 border-yellow-300 bg-yellow-500/20 p-2">
            <p className="text-2xl">🏆</p>
            <p className="mt-1 text-xs font-black text-white/75">Perfect</p>
            <p className="text-xl font-black text-[var(--game-yellow)]">
              {result.isPerfect ? "x2" : "Không"}
            </p>
          </div>
        </div>

        {result.isPerfect ? (
          <p className="relative mt-3 rounded-2xl bg-yellow-300/15 px-3 py-2 text-sm font-black text-[var(--game-yellow)]">
            Hoàn hảo! Bạn đã chọn đủ 4 chính sách bảo vệ chủ quyền kinh tế.
          </p>
        ) : (
          <p className="relative mt-3 rounded-2xl bg-white/10 px-3 py-2 text-sm font-semibold text-white/80">
            Bạn đã hoàn thành Boss Room. Hãy lưu kết quả để kết thúc game.
          </p>
        )}

        <button
          type="button"
          onClick={onFinish}
          disabled={isSubmitting}
          className="relative mt-4 w-full rounded-[18px] border-4 border-[var(--game-white)] bg-[var(--game-yellow)] py-3 text-base font-black uppercase text-[var(--game-bg-dark)] shadow-[4px_4px_0px_rgba(0,0,0,0.3)] transition hover:-translate-y-1 hover:bg-[var(--game-yellow-hover)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Đang lưu điểm..." : "Hoàn tất game ➜"}
        </button>
      </div>
    </div>
  )
}