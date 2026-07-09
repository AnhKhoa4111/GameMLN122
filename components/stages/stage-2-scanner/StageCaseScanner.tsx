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
    }
> = {
    "alpha-finance-group": {
        icon: "🏦",
        agent: "🕵️‍♂️",
        label: "Ngân hàng chi phối sản xuất",
    },
    "global-investment-fund": {
        icon: "📈",
        agent: "🧑‍💼",
        label: "Quỹ đầu tư kiểm soát vốn",
    },
    "nova-securities-network": {
        icon: "💹",
        agent: "👨‍💻",
        label: "Chứng khoán và quyền biểu quyết",
    },
    "finpay-digital-platform": {
        icon: "📱",
        agent: "🤖",
        label: "Fintech và dữ liệu",
    },
    "softpower-media-corp": {
        icon: "🎬",
        agent: "🧠",
        label: "Quyền lực mềm thuật toán",
    },
}

const optionIcons = ["🔎", "⚡", "🧩", "🎯"]

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
            setIsScanning(false)
            setIsScanned(true)

            setAnswers((currentAnswers) => [
                ...currentAnswers,
                {
                    caseId: currentCase.id,
                    selectedAnswerId,
                },
            ])
        }, 1500)
    }

    function handleNextCase() {
        if (!isScanned) return

        if (isLastCase) {
            const scoreResult = scoreStage2(answers)
            setResult(scoreResult)
            onCompleted(scoreResult.score)
            return
        }

        setCurrentCaseIndex((current) => current + 1)
        setSelectedAnswerId(null)
        setIsScanned(false)
        setIsScanning(false)
    }

    return (
        <section className="stage-enter mx-auto max-w-6xl px-4 py-8 text-[var(--game-white)]">
            {isScanned && (
                <ScanResultModal
                    isCorrect={isCorrect}
                    correctLabel={currentCase.correctLabel}
                    explanation={currentCase.explanation}
                    isLastCase={isLastCase}
                    isSubmitting={isSubmitting}
                    onNext={handleNextCase}
                />
            )}
            <div className="mb-8 text-center">
                <p className="fade-up text-sm font-black uppercase tracking-[0.24em] text-[var(--game-yellow)]">
                    Stage 2
                </p>

                <h1 className="fade-up fade-delay-1 mt-3 text-4xl font-black uppercase md:text-5xl">
                    Hồ Sơ Tư Bản Tài Chính
                </h1>

                <p className="fade-up fade-delay-2 mx-auto mt-4 max-w-3xl text-base font-semibold text-white/80">
                    Bạn là điều tra viên kinh tế. Hãy quét từng hồ sơ để xác định hình
                    thức chi phối của tư bản tài chính, chứng khoán, fintech, dữ liệu và
                    quyền lực mềm.
                </p>
            </div>

            <div
                key={currentCase.id}
                className="case-enter grid gap-6 lg:grid-cols-[1.05fr_0.95fr]"
            >
                <div className="fade-up fade-delay-1 relative overflow-hidden bg-[var(--game-bg-dark)] p-6 shadow-[8px_8px_0px_rgba(0,0,0,0.25)]">
                    {isScanning && <ScanOverlay />}

                    <div className="absolute right-4 top-4 text-5xl opacity-20">
                        {visual.icon}
                    </div>

                    <div className="mb-5 flex items-center justify-between gap-4 border-b-4 border-[var(--game-white)] pb-4">
                        <div className="flex items-center gap-4">
                            <div className="case-float flex h-20 w-20 shrink-0 items-center justify-center border-4 border-[var(--game-white)] bg-[var(--game-bg-light)] text-5xl shadow-[4px_4px_0px_rgba(0,0,0,0.25)]">
                                {visual.agent}
                            </div>

                            <div>
                                <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--game-yellow)]">
                                    Hồ sơ mật #{String(currentCase.caseNumber).padStart(2, "0")}
                                </p>

                                <h2 className="mt-2 text-3xl font-black leading-tight">
                                    {currentCase.organizationName}
                                </h2>

                                <p className="mt-1 text-sm font-black uppercase tracking-[0.12em] text-white/60">
                                    {visual.label}
                                </p>
                            </div>
                        </div>

                        <div className="border-4 border-[var(--game-white)] bg-[var(--game-bg-light)] px-4 py-2 text-center">
                            <p className="text-xs font-black uppercase text-white/70">
                                Tiến độ
                            </p>
                            <p className="text-xl font-black text-[var(--game-yellow)]">
                                {currentCaseIndex + 1}/{stage2Cases.length}
                            </p>
                        </div>
                    </div>

                    <div
                        className={`relative overflow-hidden border-4 border-[var(--game-white)] bg-[#3f1048] p-5 ${isScanning ? "scanner-glow" : ""
                            }`}
                    >
                        {isScanning && <ScanLine />}

                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center border-4 border-[var(--game-white)] bg-[var(--game-yellow)] text-2xl text-[var(--game-bg-dark)]">
                                {visual.icon}
                            </div>

                            <div>
                                <p className="text-lg font-black text-[var(--game-yellow)]">
                                    Thông tin điều tra
                                </p>
                                <p className="text-sm font-semibold text-white/60">
                                    Đọc manh mối rồi chọn loại chi phối phù hợp.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {currentCase.information.map((info, index) => (
                                <div
                                    key={info}
                                    style={{
                                        animationDelay: `${0.12 + index * 0.1}s`,
                                    }}
                                    className="fade-up flex gap-3 border-2 border-white/20 bg-white/10 p-3 transition hover:border-[var(--game-yellow)] hover:bg-white/15"
                                >
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-[var(--game-yellow)] text-sm font-black text-[var(--game-bg-dark)]">
                                        {index + 1}
                                    </span>
                                    <p className="font-semibold leading-relaxed text-white/90">
                                        {info}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-[120px_1fr]">
                        <div className="relative flex min-h-[120px] items-center justify-center overflow-hidden border-4 border-[var(--game-white)] bg-black/20">
                            <div
                                className={`text-6xl ${isScanning ? "scanner-radar" : "case-float"
                                    }`}
                            >
                                📡
                            </div>
                            {isScanning && (
                                <div className="absolute inset-4 rounded-full border-4 border-[var(--game-yellow)] opacity-50 scanner-ping" />
                            )}
                        </div>

                        <div className="flex items-center border-4 border-[var(--game-white)] bg-black/20 p-4">
                            <p
                                className={`w-full text-center text-lg font-black tracking-[0.16em] ${isScanning
                                        ? "animate-pulse text-[var(--game-yellow)]"
                                        : "text-[var(--game-yellow)]"
                                    }`}
                            >
                                {isScanning
                                    ? "ĐANG QUÉT DỮ LIỆU..."
                                    : isScanned
                                        ? "SCAN COMPLETE"
                                        : "SCAN READY"}
                            </p>
                        </div>
                    </div>

                </div>

                <div className="fade-up fade-delay-2 relative overflow-hidden bg-[var(--game-bg-dark)] p-6 shadow-[8px_8px_0px_rgba(0,0,0,0.25)]">
                    {isScanning && <ScanOverlay />}

                    <div className="mb-4 flex items-center justify-center gap-3">
                        <div className="text-4xl">🧭</div>
                        <h2 className="text-center text-2xl font-black">
                            Chọn loại chi phối
                        </h2>
                    </div>

                    <div className="grid gap-3">
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
                                        animationDelay: `${0.18 + optionIndex * 0.08}s`,
                                    }}
                                    className={`fade-up relative overflow-hidden border-4 px-4 py-4 text-left text-base font-black transition-all duration-200 ${showCorrect
                                            ? "stage-pop border-green-300 bg-green-600/50 text-white"
                                            : showWrong
                                                ? "stage-shake border-red-300 bg-red-600/50 text-white"
                                                : isSelected
                                                    ? "scale-[1.02] border-[var(--game-yellow)] bg-[var(--game-bg-light)] text-white shadow-[0_0_24px_rgba(250,204,21,0.38)]"
                                                    : "border-[var(--game-white)] bg-[#3f1048] text-white hover:-translate-y-1 hover:border-[var(--game-yellow)] hover:bg-[var(--game-bg-light)]"
                                        } disabled:cursor-not-allowed`}
                                >
                                    {isScanning && isSelected && <ScanLine />}

                                    <div className="flex items-start gap-3">
                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center border-4 border-[var(--game-white)] bg-[var(--game-yellow)] text-xl text-[var(--game-bg-dark)]">
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
                            className="mt-5 w-full border-4 border-[var(--game-white)] bg-[var(--game-yellow)] py-3 text-lg font-black text-[var(--game-bg-dark)] shadow-[4px_4px_0px_rgba(0,0,0,0.25)] transition hover:bg-[var(--game-yellow-hover)] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isScanning ? "Đang quét..." : "Quét hồ sơ"}
                        </button>
                    ) : (
                        <div className="stage-pop mt-5 border-4 border-[var(--game-white)] bg-white/10 p-4 text-center">
                            <p className="font-black text-[var(--game-yellow)]">
                                Kết quả scan đang hiển thị ở giữa màn hình
                            </p>
                        </div>
                    )}

                    <div
                        className={`relative mt-6 overflow-hidden border-4 border-[var(--game-white)] bg-[var(--game-bg-light)] p-4 ${isScanning ? "scanner-glow" : ""
                            }`}
                    >
                        {isScanning && <ScanLine />}

                        <div className="flex items-center gap-3">
                            <div className="text-3xl">🗂️</div>
                            <div>
                                <p className="text-sm font-black uppercase tracking-[0.16em] text-white/70">
                                    Đáp án đã chọn
                                </p>

                                <p className="mt-1 text-lg font-black">
                                    {selectedOption ? selectedOption.label : "Chưa chọn"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {result && (
                        <div className="stage-pop mt-6 border-4 border-[var(--game-white)] bg-[#3f1048] p-5 text-center">
                            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center text-5xl">
                                {result.isPerfect ? "🏆" : "📊"}
                            </div>

                            <p className="text-2xl font-black text-[var(--game-yellow)]">
                                Điểm Stage 2: {result.score}
                            </p>

                            <p className="mt-2 font-bold text-white/80">
                                Đúng {result.correctCount}/{result.totalCases} hồ sơ — Sai{" "}
                                {result.wrongCount}/{result.totalCases} hồ sơ
                            </p>

                            {result.isPerfect && (
                                <p className="mt-3 text-lg font-black text-[var(--game-yellow)]">
                                    Xuất sắc! Bạn đã nhận diện đúng toàn bộ hình thức chi phối.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

function ScanOverlay() {
    return (
        <div className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.16),transparent_55%)]" />
    )
}

function ScanLine() {
    return (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-14 animate-[scanDown_1.3s_ease-in-out_forwards] bg-[linear-gradient(180deg,transparent,rgba(250,204,21,0.78),transparent)]" />
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div
        className={`case-enter w-full max-w-3xl border-4 p-6 text-center shadow-[10px_10px_0px_rgba(0,0,0,0.35)] ${
          isCorrect
            ? "border-green-300 bg-[#245543]"
            : "border-red-300 bg-[#5a1f35]"
        }`}
      >
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center border-4 border-[var(--game-white)] bg-white/15 text-6xl">
          {isCorrect ? "✅" : "❌"}
        </div>

        <p className="text-sm font-black uppercase tracking-[0.24em] text-white/70">
          Kết quả quét hồ sơ
        </p>

        <h2 className="mt-2 text-3xl font-black">
          {isCorrect ? "SCAN THÀNH CÔNG" : "SCAN THẤT BẠI"}
        </h2>

        <div className="mx-auto mt-5 max-w-2xl border-4 border-[var(--game-white)] bg-black/20 p-4">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-white/70">
            Đã xác định
          </p>

          <p className="mt-2 text-2xl font-black text-[var(--game-yellow)]">
            {correctLabel}
          </p>
        </div>

        <p className="mx-auto mt-5 max-w-2xl text-left font-semibold leading-relaxed text-white/90">
          {explanation}
        </p>

        <button
          onClick={onNext}
          disabled={isSubmitting}
          className="mt-6 w-full border-4 border-[var(--game-white)] bg-[var(--game-yellow)] py-3 text-lg font-black text-[var(--game-bg-dark)] shadow-[4px_4px_0px_rgba(0,0,0,0.25)] transition hover:bg-[var(--game-yellow-hover)] disabled:cursor-wait disabled:opacity-60"
        >
          {isSubmitting
            ? "Đang lưu điểm..."
            : isLastCase
              ? "Hoàn thành Stage 2"
              : "Hồ sơ tiếp theo"}
        </button>
      </div>
    </div>
  )
}