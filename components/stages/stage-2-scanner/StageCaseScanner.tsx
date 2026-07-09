"use client"

import { useMemo, useState } from "react"
import { stage2Cases } from "@/lib/data/stage2Cases"
import { scoreStage2, type Stage2Answer } from "@/lib/scoring/scoreStage2"

type StageCaseScannerProps = {
  onCompleted: (score: number) => void
  isSubmitting?: boolean
}

const caseVisuals: Record<
  string,
  {
    icon: string
    agent: string
    label: string
    assistant: string
    mood: string
    color: string
  }
> = {
  "alpha-finance-group": {
    icon: "🏦",
    agent: "🕵️‍♂️",
    label: "Ngân hàng chi phối sản xuất",
    assistant: "Điệp viên vốn",
    mood: "Theo dấu dòng tiền!",
    color: "from-sky-400 to-blue-700",
  },
  "global-investment-fund": {
    icon: "📈",
    agent: "🧑‍💼",
    label: "Quỹ đầu tư kiểm soát vốn",
    assistant: "Nhà phân tích",
    mood: "Quỹ này đang nắm quyền rất sâu.",
    color: "from-emerald-300 to-teal-700",
  },
  "nova-securities-network": {
    icon: "💹",
    agent: "👨‍💻",
    label: "Chứng khoán và quyền biểu quyết",
    assistant: "Hacker dữ liệu",
    mood: "Kiểm tra quyền biểu quyết!",
    color: "from-purple-400 to-fuchsia-700",
  },
  "finpay-digital-platform": {
    icon: "📱",
    agent: "🤖",
    label: "Fintech và dữ liệu",
    assistant: "Robot scan",
    mood: "Dữ liệu người dùng là manh mối chính.",
    color: "from-yellow-300 to-orange-600",
  },
  "softpower-media-corp": {
    icon: "🎬",
    agent: "🧠",
    label: "Quyền lực mềm thuật toán",
    assistant: "Chuyên gia truyền thông",
    mood: "Thuật toán cũng có thể chi phối nhận thức.",
    color: "from-rose-400 to-pink-700",
  },
}

const optionIcons = ["🔎", "⚡", "🧩", "🎯"]
const confettiItems = ["🎉", "✨", "⭐", "💥", "🎊", "🔥", "🏆", "⚡"]

export default function StageCaseScanner({
  onCompleted,
  isSubmitting = false,
}: StageCaseScannerProps) {
  const [currentCaseIndex, setCurrentCaseIndex] = useState(0)
  const [answers, setAnswers] = useState<Stage2Answer[]>([])
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [isScanned, setIsScanned] = useState(false)
  const [result, setResult] = useState<ReturnType<typeof scoreStage2> | null>(
    null
  )

  const currentCase = stage2Cases[currentCaseIndex]
  const isLastCase = currentCaseIndex === stage2Cases.length - 1

  const visual = caseVisuals[currentCase.id] ?? {
    icon: "📄",
    agent: "🕵️",
    label: "Hồ sơ điều tra",
    assistant: "Điều tra viên",
    mood: "Đọc kỹ manh mối!",
    color: "from-yellow-300 to-orange-500",
  }

  const selectedOption = useMemo(() => {
    return currentCase.options.find((option) => option.id === selectedAnswerId)
  }, [currentCase.options, selectedAnswerId])

  const isCorrect = selectedAnswerId === currentCase.correctAnswerId

  function handleSelectAnswer(answerId: string) {
    if (isScanned || isScanning || result) return
    setSelectedAnswerId(answerId)
  }

  function handleScan() {
    if (!selectedAnswerId || isScanning) return

    setIsScanning(true)

    window.setTimeout(() => {
      const newAnswer: Stage2Answer = {
        caseId: currentCase.id,
        selectedAnswerId,
      }

      setAnswers((currentAnswers) => [...currentAnswers, newAnswer])
      setIsScanning(false)
      setIsScanned(true)
    }, 900)
  }

  function handleNextCase() {
    if (!isScanned || !selectedAnswerId) return

    const currentAnswer: Stage2Answer = {
      caseId: currentCase.id,
      selectedAnswerId,
    }

    const finalAnswers = answers.some(
      (answer) => answer.caseId === currentCase.id
    )
      ? answers
      : [...answers, currentAnswer]

    if (isLastCase) {
      const scoreResult = scoreStage2(finalAnswers)
      setResult(scoreResult)
      setIsScanned(false)
      return
    }

    setCurrentCaseIndex((current) => current + 1)
    setSelectedAnswerId(null)
    setIsScanned(false)
    setIsScanning(false)
  }

  return (
    <section className="stage-enter relative mx-auto max-w-6xl overflow-hidden px-4 py-4 text-[var(--game-white)]">
      <div className="pointer-events-none absolute right-[-120px] top-32 h-64 w-64 rounded-full bg-fuchsia-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-[-80px] h-52 w-52 rounded-full bg-cyan-400/10 blur-3xl" />

      {isScanned && !result && (
        <ScanResultModal
          isCorrect={isCorrect}
          correctLabel={currentCase.correctLabel}
          explanation={currentCase.explanation}
          isLastCase={isLastCase}
          isSubmitting={isSubmitting}
          onNext={handleNextCase}
        />
      )}

      {result && (
        <Stage2CompleteModal
          result={result}
          isSubmitting={isSubmitting}
          onNextStage={() => onCompleted(result.score)}
        />
      )}

      <div className="relative mb-4 text-center">
        <div className="fade-up mx-auto inline-flex items-center gap-2 border-4 border-[var(--game-white)] bg-[var(--game-bg-dark)] px-4 py-1.5 shadow-[4px_4px_0px_rgba(0,0,0,0.3)]">
          <span className="animate-bounce text-xl">🗂️</span>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--game-yellow)]">
            Stage 2
          </p>
          <span className="animate-bounce text-xl [animation-delay:0.2s]">
            📡
          </span>
        </div>

        <h1 className="fade-up fade-delay-1 mt-3 text-3xl font-black uppercase leading-tight md:text-5xl">
          Hồ Sơ{" "}
          <span className="text-[var(--game-yellow)] drop-shadow-[3px_3px_0px_rgba(0,0,0,0.45)]">
            Tư Bản Tài Chính
          </span>
        </h1>

        <div className="fade-up fade-delay-2 mx-auto mt-3 flex max-w-3xl items-center gap-3 rounded-[22px] border-4 border-[var(--game-white)] bg-black/25 p-3 text-left shadow-[5px_5px_0px_rgba(0,0,0,0.25)]">
          <div className="case-float flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-[var(--game-white)] bg-[var(--game-yellow)] text-4xl shadow-[4px_4px_0px_rgba(0,0,0,0.3)]">
            {visual.agent}
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--game-yellow)]">
              {visual.assistant}
            </p>
            <p className="mt-1 text-sm font-semibold text-white/85">
              {visual.mood} Chọn đáp án đúng rồi bấm{" "}
              <span className="font-black text-[var(--game-yellow)]">
                Quét hồ sơ
              </span>{" "}
              để kiểm tra.
            </p>
          </div>
        </div>
      </div>

      <div
        key={currentCase.id}
        className="case-enter relative grid gap-4 lg:grid-cols-[1.05fr_0.95fr]"
      >
        <div className="fade-up fade-delay-1 relative overflow-hidden rounded-[22px] border-4 border-[var(--game-white)] bg-[linear-gradient(135deg,#221038,#3f1048)] p-4 shadow-[8px_8px_0px_rgba(0,0,0,0.28)]">
          {isScanning && <ScanOverlay />}

          <div className="pointer-events-none absolute -right-8 -top-8 text-8xl opacity-10">
            {visual.icon}
          </div>

          <div className="mb-3 flex items-center justify-between gap-3 border-b-4 border-[var(--game-white)] pb-3">
            <div className="flex min-w-0 items-center gap-3">
              <div
                className={`case-float flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-4 border-[var(--game-white)] bg-gradient-to-br ${visual.color} text-4xl shadow-[4px_4px_0px_rgba(0,0,0,0.25)]`}
              >
                {visual.agent}
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--game-yellow)]">
                  Hồ sơ mật #{String(currentCase.caseNumber).padStart(2, "0")}
                </p>

                <h2 className="mt-1 truncate text-2xl font-black leading-tight">
                  {currentCase.organizationName}
                </h2>

                <p className="mt-0.5 text-[10px] font-black uppercase tracking-[0.12em] text-white/60">
                  {visual.label}
                </p>
              </div>
            </div>

            <div className="relative shrink-0 border-4 border-[var(--game-white)] bg-[var(--game-bg-light)] px-3 py-1.5 text-center shadow-[3px_3px_0px_rgba(0,0,0,0.25)]">
              <span className="absolute -right-2 -top-2 text-xl">⚡</span>
              <p className="text-[10px] font-black uppercase text-white/70">
                Tiến độ
              </p>
              <p className="text-xl font-black text-[var(--game-yellow)]">
                {currentCaseIndex + 1}/{stage2Cases.length}
              </p>
            </div>
          </div>

          <div
            className={`relative overflow-hidden rounded-[18px] border-4 border-[var(--game-white)] bg-[#3f1048] p-3 ${
              isScanning ? "scanner-glow" : ""
            }`}
          >
            {isScanning && <ScanLine />}

            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border-4 border-[var(--game-white)] bg-[var(--game-yellow)] text-xl text-[var(--game-bg-dark)]">
                {visual.icon}
              </div>

              <div>
                <p className="text-base font-black text-[var(--game-yellow)]">
                  Thông tin điều tra
                </p>
                <p className="text-xs font-semibold text-white/60">
                  Đọc manh mối rồi chọn loại chi phối phù hợp.
                </p>
              </div>
            </div>

            <div className="grid gap-2">
              {currentCase.information.map((info, index) => (
                <div
                  key={info}
                  style={{
                    animationDelay: `${0.08 + index * 0.06}s`,
                  }}
                  className="fade-up flex gap-2 rounded-xl border-2 border-white/20 bg-white/10 p-2 transition hover:border-[var(--game-yellow)] hover:bg-white/15"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--game-yellow)] text-xs font-black text-[var(--game-bg-dark)]">
                    {index + 1}
                  </span>
                  <p className="line-clamp-2 text-sm font-semibold leading-relaxed text-white/90">
                    {info}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 grid gap-3 md:grid-cols-[90px_1fr]">
            <div className="relative flex min-h-[80px] items-center justify-center overflow-hidden rounded-[18px] border-4 border-[var(--game-white)] bg-black/20">
              <div
                className={`text-5xl ${
                  isScanning ? "scanner-radar" : "case-float"
                }`}
              >
                📡
              </div>

              {isScanning && (
                <div className="absolute inset-3 rounded-full border-4 border-[var(--game-yellow)] opacity-50 scanner-ping" />
              )}
            </div>

            <div className="flex items-center rounded-[18px] border-4 border-[var(--game-white)] bg-black/20 p-3">
              <div className="w-full">
                <p
                  className={`text-center text-base font-black tracking-[0.14em] ${
                    isScanning
                      ? "animate-pulse text-[var(--game-yellow)]"
                      : "text-[var(--game-yellow)]"
                  }`}
                >
                  {isScanning
                    ? "ĐANG QUÉT..."
                    : isScanned
                      ? "SCAN COMPLETE"
                      : "SCAN READY"}
                </p>

                <div className="mt-2 h-3 overflow-hidden rounded-full border-2 border-[var(--game-white)] bg-black/30">
                  <div
                    className="h-full bg-[var(--game-yellow)] transition-all duration-500"
                    style={{
                      width: `${((currentCaseIndex + (isScanned ? 1 : 0)) / stage2Cases.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="fade-up fade-delay-2 relative overflow-hidden rounded-[22px] border-4 border-[var(--game-white)] bg-[linear-gradient(135deg,#3f1048,#1d102d)] p-4 shadow-[8px_8px_0px_rgba(0,0,0,0.28)]">
          {isScanning && <ScanOverlay />}

          <div className="mb-3 flex items-center justify-center gap-2 border-b-4 border-[var(--game-white)] pb-3">
            <h2 className="text-center text-xl font-black">Chọn loại chi phối</h2>
          </div>

          <div className="grid gap-2">
            {currentCase.options.map((option, optionIndex) => {
              const isSelected = selectedAnswerId === option.id
              const showCorrect =
                isScanned && option.id === currentCase.correctAnswerId
              const showWrong = isScanned && isSelected && !showCorrect

              return (
                <button
                  key={option.id}
                  type="button"
                  disabled={isScanned || isScanning || Boolean(result)}
                  onClick={() => handleSelectAnswer(option.id)}
                  style={{
                    animationDelay: `${0.12 + optionIndex * 0.06}s`,
                  }}
                  className={`fade-up relative overflow-hidden rounded-[18px] border-4 px-3 py-3 text-left text-sm font-black transition-all duration-200 ${
                    showCorrect
                      ? "stage-pop border-green-300 bg-green-600/50 text-white"
                      : showWrong
                        ? "stage-shake border-red-300 bg-red-600/50 text-white"
                        : isSelected
                          ? "scale-[1.01] border-[var(--game-yellow)] bg-[var(--game-bg-light)] text-white shadow-[0_0_20px_rgba(250,204,21,0.35)]"
                          : "border-[var(--game-white)] bg-[#3f1048] text-white hover:-translate-y-1 hover:border-[var(--game-yellow)] hover:bg-[var(--game-bg-light)]"
                  } disabled:cursor-not-allowed`}
                >
                  {isScanning && isSelected && <ScanLine />}

                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-4 border-[var(--game-white)] bg-[var(--game-yellow)] text-lg text-[var(--game-bg-dark)]">
                      {optionIcons[optionIndex] ?? "🔎"}
                    </span>

                    <span className="leading-relaxed">{option.label}</span>
                  </div>
                </button>
              )
            })}
          </div>

          {!isScanned ? (
            <button
              onClick={handleScan}
              disabled={!selectedAnswerId || isScanning || Boolean(result)}
              className="mt-3 w-full rounded-[18px] border-4 border-[var(--game-white)] bg-[var(--game-yellow)] py-3 text-base font-black uppercase text-[var(--game-bg-dark)] shadow-[4px_4px_0px_rgba(0,0,0,0.25)] transition hover:-translate-y-1 hover:bg-[var(--game-yellow-hover)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {isScanning ? "Đang quét..." : "Quét hồ sơ 📡"}
            </button>
          ) : (
            <div className="stage-pop mt-3 rounded-[18px] border-4 border-[var(--game-white)] bg-white/10 p-3 text-center">
              <p className="text-sm font-black text-[var(--game-yellow)]">
                Kết quả scan đang hiển thị
              </p>
            </div>
          )}

          <div
            className={`relative mt-3 overflow-hidden rounded-[18px] border-4 border-[var(--game-white)] bg-[var(--game-bg-light)] p-3 ${
              isScanning ? "scanner-glow" : ""
            }`}
          >
            {isScanning && <ScanLine />}

            <div className="flex items-center gap-3">
              <div className="text-3xl">🗂️</div>
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-white/70">
                  Đáp án đã chọn
                </p>

                <p className="mt-0.5 truncate text-base font-black">
                  {selectedOption ? selectedOption.label : "Chưa chọn"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3 rounded-[18px] border-4 border-white/30 bg-black/20 p-3">
            <div className="mb-2 flex items-center justify-between text-xs font-black">
              <span>Tiến độ hồ sơ</span>
              <span className="text-[var(--game-yellow)]">
                {currentCaseIndex + 1}/{stage2Cases.length}
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full border-2 border-[var(--game-white)] bg-black/30">
              <div
                className="h-full bg-[var(--game-yellow)] transition-all duration-500"
                style={{
                  width: `${((currentCaseIndex + 1) / stage2Cases.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ScanOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.12),transparent_55%)]" />
  )
}

function ScanLine() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-10 animate-[scanDown_0.9s_ease-in-out_forwards] bg-[linear-gradient(180deg,transparent,rgba(250,204,21,0.78),transparent)]" />
  )
}

function ScanResultModal({
  isCorrect,
  correctLabel,
  explanation,
  isLastCase,
  isSubmitting,
  onNext,
}: {
  isCorrect: boolean
  correctLabel: string
  explanation: string
  isLastCase: boolean
  isSubmitting: boolean
  onNext: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 px-4 backdrop-blur-sm">
      <div
        className={`case-enter relative w-full max-w-[560px] overflow-hidden rounded-[28px] border-4 p-5 text-center shadow-[10px_10px_0px_rgba(0,0,0,0.35)] ${
          isCorrect
            ? "border-green-300 bg-[#245543]"
            : "border-red-300 bg-[#5a1f35]"
        }`}
      >
        <div className="pointer-events-none absolute -right-8 -top-8 text-8xl opacity-10">
          {isCorrect ? "✅" : "❌"}
        </div>

        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full border-4 border-[var(--game-white)] bg-white/15 text-5xl">
          {isCorrect ? "✅" : "❌"}
        </div>

        <p className="text-xs font-black uppercase tracking-[0.22em] text-white/70">
          Kết quả quét hồ sơ
        </p>

        <h2 className="mt-2 text-2xl font-black">
          {isCorrect ? "SCAN THÀNH CÔNG" : "SCAN THẤT BẠI"}
        </h2>

        <div className="mx-auto mt-4 max-w-lg rounded-[18px] border-4 border-[var(--game-white)] bg-black/20 p-3">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-white/70">
            Đáp án đúng
          </p>

          <p className="mt-1 text-xl font-black text-[var(--game-yellow)]">
            {correctLabel}
          </p>
        </div>

        <p className="mx-auto mt-4 max-w-lg text-left text-sm font-semibold leading-relaxed text-white/90">
          {explanation}
        </p>

        <button
          onClick={onNext}
          disabled={isSubmitting}
          className="mt-5 w-full rounded-[18px] border-4 border-[var(--game-white)] bg-[var(--game-yellow)] py-3 text-base font-black uppercase text-[var(--game-bg-dark)] shadow-[4px_4px_0px_rgba(0,0,0,0.25)] transition hover:-translate-y-1 hover:bg-[var(--game-yellow-hover)] disabled:cursor-wait disabled:opacity-60"
        >
          {isSubmitting
            ? "Đang lưu điểm..."
            : isLastCase
              ? "Xem điểm Stage 2"
              : "Hồ sơ tiếp theo ➜"}
        </button>
      </div>
    </div>
  )
}

function Stage2CompleteModal({
  result,
  isSubmitting,
  onNextStage,
}: {
  result: ReturnType<typeof scoreStage2>
  isSubmitting: boolean
  onNextStage: () => void
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
          🗂️
        </div>

        <div className="relative mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full border-4 border-[var(--game-white)] bg-[var(--game-yellow)] text-5xl shadow-[5px_5px_0px_rgba(0,0,0,0.35)]">
          {result.isPerfect ? "🏆" : "📊"}
          <span className="absolute -right-3 -top-2 animate-ping text-2xl">
            ✨
          </span>
        </div>

        <p className="relative text-xs font-black uppercase tracking-[0.22em] text-[var(--game-yellow)]">
          Hoàn thành Stage 2
        </p>

        <h2 className="relative mt-2 text-2xl font-black uppercase leading-tight text-[var(--game-white)] md:text-3xl">
          Hồ Sơ Tư Bản Tài Chính
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
              {result.correctCount}/{result.totalCases}
            </p>
          </div>

          <div className="rounded-2xl border-4 border-red-300 bg-red-500/25 p-2">
            <p className="text-2xl">❌</p>
            <p className="mt-1 text-xs font-black text-white/75">Sai</p>
            <p className="text-xl font-black text-red-200">
              {result.wrongCount}/{result.totalCases}
            </p>
          </div>
        </div>

        {result.isPerfect ? (
          <p className="relative mt-3 rounded-2xl bg-yellow-300/15 px-3 py-2 text-sm font-black text-[var(--game-yellow)]">
            Xuất sắc! Bạn đã nhận diện đúng toàn bộ hình thức chi phối.
          </p>
        ) : (
          <p className="relative mt-3 rounded-2xl bg-white/10 px-3 py-2 text-sm font-semibold text-white/80">
            Bạn đã hoàn thành điều tra. Tiếp tục sang Stage 3 để mở khóa thử
            thách tiếp theo!
          </p>
        )}

        <button
          type="button"
          onClick={onNextStage}
          disabled={isSubmitting}
          className="relative mt-4 w-full rounded-[18px] border-4 border-[var(--game-white)] bg-[var(--game-yellow)] py-3 text-base font-black uppercase text-[var(--game-bg-dark)] shadow-[4px_4px_0px_rgba(0,0,0,0.3)] transition hover:-translate-y-1 hover:bg-[var(--game-yellow-hover)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Đang lưu điểm..." : "Sang Stage 3 ➜"}
        </button>
      </div>
    </div>
  )
}