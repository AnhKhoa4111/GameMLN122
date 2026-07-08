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

export default function StageDecisionMaker({
  onCompleted,
  isSubmitting = false,
}: StageDecisionMakerProps) {
  const [activeCaseIndex, setActiveCaseIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, Stage4DecisionAnswer>>({})
  const [isCompleted, setIsCompleted] = useState(false)

  const activeCase = stage4CompanyCases[activeCaseIndex]
  const selectedAnswer = answers[activeCase.id]
  const selectedOption = stage4DecisionOptions.find((option) => option.value === selectedAnswer)
  const correctOption = stage4DecisionOptions.find(
    (option) => option.value === activeCase.correctAnswer
  )
  const result = useMemo(() => scoreStage4(answers), [answers])
  const isLastCase = activeCaseIndex === stage4CompanyCases.length - 1

  function chooseAnswer(answer: Stage4DecisionAnswer) {
    if (selectedAnswer || isCompleted) return

    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [activeCase.id]: answer,
    }))
  }

  function goToNextCase() {
    if (!selectedAnswer) return

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
    <section className="mt-8">
      <div className="grid gap-5 lg:grid-cols-[1fr_0.85fr]">
        <div className="border-4 border-[var(--game-white)] bg-[var(--game-bg-dark)] p-5 shadow-[8px_8px_0px_rgba(0,0,0,0.25)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--game-yellow)]">
                Phòng 4 - Hồ Sơ Việt Nam
              </p>
              <h2 className="mt-2 text-3xl font-black">{activeCase.companyName}</h2>
              <p className="mt-1 text-sm font-bold text-white/70">{activeCase.origin}</p>
            </div>

            <div className="border-4 border-[var(--game-white)] bg-[var(--game-yellow)] px-4 py-2 text-center font-black text-[var(--game-bg-dark)]">
              {activeCaseIndex + 1}/{stage4CompanyCases.length}
            </div>
          </div>

          <div className="mt-5 border-4 border-white/30 bg-[var(--game-bg-light)] p-5">
            <p className="text-2xl font-black leading-tight">{activeCase.headline}</p>
            <p className="mt-3 text-sm font-bold text-white/75">{activeCase.proposal}</p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
            {activeCase.chain.map((item) => (
              <div
                key={item}
                className="border-4 border-[var(--game-white)] bg-[#3f1048] px-3 py-4 text-center font-black"
              >
                {item}
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <QuickSignal title="Điểm sáng" value={activeCase.potential[0]} tone="good" />
            <QuickSignal title="Điểm đỏ" value={activeCase.risks[0]} tone="risk" />
          </div>
        </div>

        <div className="border-4 border-[var(--game-white)] bg-[var(--game-bg-dark)] p-5 shadow-[8px_8px_0px_rgba(0,0,0,0.25)]">
          <h3 className="text-2xl font-black">Chốt quyết định</h3>
          <p className="mt-2 text-sm font-semibold text-white/70">
            Nhìn nhanh hồ sơ, chọn hướng xử lý cho Việt Nam.
          </p>

          <div className="mt-5 grid gap-3">
            {stage4DecisionOptions.map((option) => {
              const isSelected = selectedAnswer === option.value
              const isCorrect = activeCase.correctAnswer === option.value
              const shouldReveal = Boolean(selectedAnswer)

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => chooseAnswer(option.value)}
                  disabled={Boolean(selectedAnswer) || isCompleted}
                  className={`border-4 p-4 text-left font-black transition ${
                    shouldReveal && isCorrect
                      ? "border-green-200 bg-green-600/50"
                      : isSelected
                        ? "border-red-200 bg-red-600/50"
                        : "border-[var(--game-white)] bg-[var(--game-bg-light)] hover:bg-[var(--game-bg-focus)]"
                  } disabled:cursor-not-allowed`}
                >
                  <span className="mr-3 inline-flex h-8 w-8 items-center justify-center bg-[var(--game-yellow)] text-[var(--game-bg-dark)]">
                    {option.shortLabel}
                  </span>
                  {option.label}
                </button>
              )
            })}
          </div>

          {selectedAnswer && (
            <div className="mt-5 border-4 border-[var(--game-white)] bg-[#3f1048] p-4">
              <p className="font-black text-[var(--game-yellow)]">
                Đúng: {correctOption?.shortLabel} - {correctOption?.label}
              </p>
              <p className="mt-1 text-sm font-bold text-white/70">
                Bạn chọn: {selectedOption?.shortLabel} - {selectedOption?.label}
              </p>
              <p className="mt-3 text-lg font-black">{activeCase.correctSummary}</p>
              <p className="mt-2 text-sm font-semibold text-white/80">{activeCase.explanation}</p>
              <p className="mt-3 border-l-4 border-[var(--game-yellow)] pl-3 text-sm font-bold text-white/85">
                {activeCase.vietnamLesson}
              </p>
            </div>
          )}

          {!isCompleted ? (
            <Button
              type="button"
              onClick={goToNextCase}
              disabled={!selectedAnswer}
              className="mt-5 w-full"
            >
              {isLastCase ? "Tổng kết" : "Hồ sơ tiếp"}
            </Button>
          ) : (
            <div className="mt-5 border-4 border-[var(--game-white)] bg-[var(--game-bg-light)] p-5 text-center">
              <p className="text-2xl font-black">
                Điểm Phòng 4: <span className="text-[var(--game-yellow)]">{result.score}</span>
              </p>
              <p className="mt-2 font-bold text-white/80">
                Đúng {result.correctCount}/{result.totalCases} hồ sơ
              </p>
              <Button
                type="button"
                onClick={completeStage}
                disabled={isSubmitting}
                className="mt-4 w-full"
              >
                {isSubmitting ? "Đang lưu..." : "Lưu và qua Phòng 5"}
              </Button>
            </div>
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
  const color = tone === "good" ? "text-green-200" : "text-red-100"

  return (
    <div className="border-4 border-[var(--game-white)] bg-[#3f1048] p-4">
      <p className={`text-sm font-black uppercase tracking-[0.14em] ${color}`}>{title}</p>
      <p className="mt-2 text-sm font-bold text-white/80">{value}</p>
    </div>
  )
}
