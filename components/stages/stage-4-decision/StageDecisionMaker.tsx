"use client"

import { useMemo, useState } from "react"
import Button from "@/components/ui/Button"
import {
  stage4CompanyCases,
  stage4DecisionOptions,
  type Stage4DecisionAnswer,
} from "@/lib/data/stage4Decisions"
import { scoreStage4 } from "@/lib/scoring/scoreStage4"

type StageDecisionMakerProps = {
  onCompleted: (score: number) => void
  isSubmitting?: boolean
}

const caseVisuals: Record<
  string,
  {
    icon: string
    character: string
    role: string
    color: string
  }
> = {
  default: {
    icon: "🏢",
    character: "🧑‍⚖️",
    role: "Tổ phân tích chính sách",
    color: "from-purple-400 to-fuchsia-700",
  },
}

const decisionIcons: Record<string, string> = {
  approve: "✅",
  condition: "⚖️",
  restrict: "🛡️",
  reject: "🚫",
}

const confettiItems = ["🎉", "✨", "⭐", "💥", "🎊", "🔥", "🏆", "⚡"]

export default function StageDecisionMaker({
  onCompleted,
  isSubmitting = false,
}: StageDecisionMakerProps) {
  const [activeCaseIndex, setActiveCaseIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, Stage4DecisionAnswer>>({})
  const [confirmedCaseIds, setConfirmedCaseIds] = useState<string[]>([])
  const [isCompleted, setIsCompleted] = useState(false)

  const activeCase = stage4CompanyCases[activeCaseIndex]
  const selectedAnswer = answers[activeCase.id]
  const isCaseConfirmed = confirmedCaseIds.includes(activeCase.id)

  const selectedOption = stage4DecisionOptions.find(
    (option) => option.value === selectedAnswer
  )

  const correctOption = stage4DecisionOptions.find(
    (option) => option.value === activeCase.correctAnswer
  )

  const result = useMemo(() => scoreStage4(answers), [answers])
  const isLastCase = activeCaseIndex === stage4CompanyCases.length - 1

  const visual = caseVisuals[activeCase.id] ?? caseVisuals.default

  function chooseAnswer(answer: Stage4DecisionAnswer) {
    if (isCaseConfirmed || isCompleted) return

    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [activeCase.id]: answer,
    }))
  }

  function confirmAnswer() {
    if (!selectedAnswer || isCaseConfirmed || isCompleted) return

    setConfirmedCaseIds((currentIds) => [...currentIds, activeCase.id])
  }

  function goToNextCase() {
    if (!isCaseConfirmed) return

    if (isLastCase) {
      setIsCompleted(true)
      return
    }

    setActiveCaseIndex((currentIndex) => currentIndex + 1)
  }

  function completeStage() {
    if (!isCompleted) return
    onCompleted(result.score)
  }

  return (
    <section className="stage-enter relative mx-auto max-w-6xl overflow-hidden px-4 py-4 text-[var(--game-white)]">
      <div className="pointer-events-none absolute right-[-120px] top-24 h-64 w-64 rounded-full bg-fuchsia-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-[-80px] h-52 w-52 rounded-full bg-cyan-400/10 blur-3xl" />

      {isCompleted && (
        <Stage4CompleteModal
          result={result}
          isSubmitting={isSubmitting}
          onContinue={completeStage}
        />
      )}

      <div className="relative mb-4 text-center">
        <div className="fade-up mx-auto inline-flex items-center gap-2 border-4 border-[var(--game-white)] bg-[var(--game-bg-dark)] px-4 py-1.5 shadow-[4px_4px_0px_rgba(0,0,0,0.3)]">
          <span className="animate-bounce text-xl">🇻🇳</span>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--game-yellow)]">
            Stage 4
          </p>
          <span className="animate-bounce text-xl [animation-delay:0.2s]">
            ⚖️
          </span>
        </div>

        <h1 className="fade-up fade-delay-1 mt-3 text-3xl font-black uppercase leading-tight md:text-5xl">
          Hồ Sơ{" "}
          <span className="text-[var(--game-yellow)] drop-shadow-[3px_3px_0px_rgba(0,0,0,0.45)]">
            Việt Nam
          </span>
        </h1>

        <div className="fade-up fade-delay-2 mx-auto mt-3 flex max-w-3xl items-center gap-3 rounded-[22px] border-4 border-[var(--game-white)] bg-black/25 p-3 text-left shadow-[5px_5px_0px_rgba(0,0,0,0.25)]">
          <div className="case-float flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-[var(--game-white)] bg-[var(--game-yellow)] text-4xl shadow-[4px_4px_0px_rgba(0,0,0,0.3)]">
            🧑‍⚖️
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--game-yellow)]">
              Hội đồng chiến lược
            </p>
            <p className="mt-1 text-sm font-semibold text-white/85">
              Đọc nhanh hồ sơ, chọn hướng xử lý. Bạn có thể{" "}
              <span className="font-black text-[var(--game-yellow)]">
                đổi đáp án trước khi chốt
              </span>
              .
            </p>
          </div>
        </div>
      </div>

      <div className="case-enter grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="fade-up fade-delay-1 relative overflow-hidden rounded-[22px] border-4 border-[var(--game-white)] bg-[linear-gradient(135deg,#221038,#3f1048)] p-4 shadow-[8px_8px_0px_rgba(0,0,0,0.28)]">
          <div className="pointer-events-none absolute -right-8 -top-8 text-8xl opacity-10">
            🏢
          </div>

          <div className="mb-3 flex flex-wrap items-center justify-between gap-3 border-b-4 border-[var(--game-white)] pb-3">
            <div className="flex min-w-0 items-center gap-3">
              <div
                className={`case-float flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-4 border-[var(--game-white)] bg-gradient-to-br ${visual.color} text-4xl shadow-[4px_4px_0px_rgba(0,0,0,0.25)]`}
              >
                {visual.character}
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--game-yellow)]">
                  Hồ sơ #{activeCaseIndex + 1}
                </p>

                <h2 className="mt-1 truncate text-2xl font-black">
                  {activeCase.companyName}
                </h2>

                <p className="mt-0.5 text-xs font-bold text-white/65">
                  {activeCase.origin}
                </p>
              </div>
            </div>

            <div className="relative border-4 border-[var(--game-white)] bg-[var(--game-yellow)] px-3 py-1.5 text-center font-black text-[var(--game-bg-dark)] shadow-[3px_3px_0px_rgba(0,0,0,0.25)]">
              <span className="absolute -right-2 -top-2 text-xl">⚡</span>
              {activeCaseIndex + 1}/{stage4CompanyCases.length}
            </div>
          </div>

          <div className="rounded-[18px] border-4 border-white/30 bg-[var(--game-bg-light)] p-4">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border-4 border-[var(--game-white)] bg-[var(--game-yellow)] text-xl text-[var(--game-bg-dark)]">
                📄
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-white/60">
                  Đề xuất đầu tư
                </p>
                <p className="text-lg font-black leading-tight">
                  {activeCase.headline}
                </p>
              </div>
            </div>

            <p className="line-clamp-3 text-sm font-bold leading-relaxed text-white/75">
              {activeCase.proposal}
            </p>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">
            {activeCase.chain.map((item, index) => (
              <div
                key={item}
                style={{
                  animationDelay: `${0.08 + index * 0.06}s`,
                }}
                className="fade-up rounded-[16px] border-4 border-[var(--game-white)] bg-[#3f1048] px-2 py-3 text-center text-sm font-black shadow-[3px_3px_0px_rgba(0,0,0,0.2)]"
              >
                <p className="mb-1 text-xl">
                  {index === 0
                    ? "🏭"
                    : index === 1
                      ? "💰"
                      : index === 2
                        ? "📊"
                        : "🇻🇳"}
                </p>
                <p className="line-clamp-1">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <QuickSignal
              title="Điểm sáng"
              value={activeCase.potential[0]}
              tone="good"
            />
            <QuickSignal
              title="Điểm đỏ"
              value={activeCase.risks[0]}
              tone="risk"
            />
          </div>

          <div className="mt-3 rounded-[18px] border-4 border-white/30 bg-black/20 p-3">
            <div className="mb-2 flex items-center justify-between text-xs font-black">
              <span>Tiến độ xử lý hồ sơ</span>
              <span className="text-[var(--game-yellow)]">
                {activeCaseIndex + 1}/{stage4CompanyCases.length}
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full border-2 border-[var(--game-white)] bg-black/30">
              <div
                className="h-full bg-[var(--game-yellow)] transition-all duration-500"
                style={{
                  width: `${((activeCaseIndex + 1) / stage4CompanyCases.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="fade-up fade-delay-2 relative overflow-hidden rounded-[22px] border-4 border-[var(--game-white)] bg-[linear-gradient(135deg,#3f1048,#1d102d)] p-4 shadow-[8px_8px_0px_rgba(0,0,0,0.28)]">
          <div className="pointer-events-none absolute -right-8 -top-8 text-8xl opacity-10">
            🧭
          </div>

          <div className="mb-3 border-b-4 border-[var(--game-white)] pb-3 text-center">
            <div className="case-float mx-auto text-4xl">🛡️</div>
            <h3 className="mt-1 text-xl font-black">Chốt quyết định</h3>
            <p className="mt-1 text-xs font-semibold text-white/70">
              Chọn hướng xử lý phù hợp cho Việt Nam.
            </p>
          </div>

          <div className="mb-3 rounded-[18px] border-4 border-white/30 bg-black/20 p-3">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--game-yellow)]">
              Cách chơi
            </p>
            <p className="mt-1 text-sm font-bold text-white/80">
              1. Chọn đáp án → 2. Có thể đổi đáp án → 3. Bấm Chốt đáp án.
            </p>
          </div>

          <div className="grid gap-2">
            {stage4DecisionOptions.map((option, optionIndex) => {
              const isSelected = selectedAnswer === option.value
              const isCorrect = activeCase.correctAnswer === option.value
              const shouldReveal = isCaseConfirmed

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => chooseAnswer(option.value)}
                  disabled={isCaseConfirmed || isCompleted}
                  style={{
                    animationDelay: `${0.1 + optionIndex * 0.06}s`,
                  }}
                  className={`fade-up rounded-[18px] border-4 p-3 text-left text-sm font-black transition ${
                    shouldReveal && isCorrect
                      ? "stage-pop border-green-200 bg-green-600/50 text-white"
                      : shouldReveal && isSelected && !isCorrect
                        ? "stage-shake border-red-200 bg-red-600/50 text-white"
                        : isSelected
                          ? "scale-[1.01] border-[var(--game-yellow)] bg-[var(--game-bg-light)] text-white shadow-[0_0_20px_rgba(250,204,21,0.35)]"
                          : "border-[var(--game-white)] bg-[#3f1048] text-white hover:-translate-y-1 hover:border-[var(--game-yellow)] hover:bg-[var(--game-bg-light)]"
                  } disabled:cursor-not-allowed`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-4 border-[var(--game-white)] bg-[var(--game-yellow)] text-xl text-[var(--game-bg-dark)]">
                      {decisionIcons[option.value] ?? option.shortLabel}
                    </span>

                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.14em] text-white/60">
                        Phương án {option.shortLabel}
                      </p>
                      <p className="mt-0.5">{option.label}</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {!isCaseConfirmed ? (
            <Button
              type="button"
              onClick={confirmAnswer}
              disabled={!selectedAnswer}
              className="mt-3 w-full"
            >
              Chốt đáp án
            </Button>
          ) : (
            <div className="stage-pop mt-3 rounded-[18px] border-4 border-[var(--game-white)] bg-[#3f1048] p-3">
              <p className="text-sm font-black text-[var(--game-yellow)]">
                Đáp án đúng: {correctOption?.shortLabel} - {correctOption?.label}
              </p>

              <p className="mt-1 text-xs font-bold text-white/70">
                Bạn chọn: {selectedOption?.shortLabel} - {selectedOption?.label}
              </p>

              <p className="mt-2 text-base font-black">
                {activeCase.correctSummary}
              </p>

              <p className="mt-1 line-clamp-3 text-sm font-semibold text-white/80">
                {activeCase.explanation}
              </p>

              <p className="mt-2 rounded-xl border-l-4 border-[var(--game-yellow)] bg-white/10 px-3 py-2 text-xs font-bold text-white/85">
                {activeCase.vietnamLesson}
              </p>
            </div>
          )}

          {isCaseConfirmed && !isCompleted && (
            <Button
              type="button"
              onClick={goToNextCase}
              disabled={!isCaseConfirmed}
              className="mt-3 w-full"
            >
              {isLastCase ? "Xem điểm Stage 4" : "Hồ sơ tiếp ➜"}
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}

function QuickSignal({
  title,
  value,
  tone,
}: {
  title: string
  value: string
  tone: "good" | "risk"
}) {
  const icon = tone === "good" ? "✅" : "🚨"
  const color = tone === "good" ? "text-green-200" : "text-red-100"
  const bg = tone === "good" ? "bg-green-500/20" : "bg-red-500/20"

  return (
    <div
      className={`rounded-[18px] border-4 border-[var(--game-white)] ${bg} p-3 shadow-[3px_3px_0px_rgba(0,0,0,0.2)]`}
    >
      <div className="mb-1 flex items-center gap-2">
        <span className="text-2xl">{icon}</span>
        <p className={`text-xs font-black uppercase tracking-[0.14em] ${color}`}>
          {title}
        </p>
      </div>

      <p className="line-clamp-3 text-sm font-bold text-white/80">{value}</p>
    </div>
  )
}

function Stage4CompleteModal({
  result,
  isSubmitting,
  onContinue,
}: {
  result: ReturnType<typeof scoreStage4>
  isSubmitting: boolean
  onContinue: () => void
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

      <div className="case-enter relative w-full max-w-[520px] overflow-hidden rounded-[28px] border-4 border-[var(--game-white)] bg-[linear-gradient(135deg,#3f1048,#1b102b)] p-5 text-center shadow-[10px_10px_0px_rgba(0,0,0,0.4)]">
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
          Hoàn thành Stage 4
        </p>

        <h2 className="relative mt-2 text-2xl font-black uppercase leading-tight text-[var(--game-white)] md:text-3xl">
          Hồ Sơ Việt Nam
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
          Đúng {result.correctCount}/{result.totalCases} hồ sơ
        </p>

        {result.isPerfect ? (
          <p className="relative mt-3 rounded-2xl bg-yellow-300/15 px-3 py-2 text-sm font-black text-[var(--game-yellow)]">
            Xuất sắc! Bạn đã đưa ra toàn bộ quyết định chính xác.
          </p>
        ) : (
          <p className="relative mt-3 rounded-2xl bg-white/10 px-3 py-2 text-sm font-semibold text-white/80">
            Bạn đã hoàn thành vòng ra quyết định. Tiếp tục sang Stage 5 để bảo
            vệ Việt Nam.
          </p>
        )}

        <button
          type="button"
          onClick={onContinue}
          disabled={isSubmitting}
          className="relative mt-4 w-full rounded-[18px] border-4 border-[var(--game-white)] bg-[var(--game-yellow)] py-3 text-base font-black uppercase text-[var(--game-bg-dark)] shadow-[4px_4px_0px_rgba(0,0,0,0.3)] transition hover:-translate-y-1 hover:bg-[var(--game-yellow-hover)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Đang lưu điểm..." : "Sang Stage 5 ➜"}
        </button>
      </div>
    </div>
  )
}