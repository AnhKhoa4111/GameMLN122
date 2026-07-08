import { stage2Cases } from "@/lib/data/stage2Cases"

export type Stage2Answer = {
  caseId: string
  selectedAnswerId: string
}

export function scoreStage2(answers: Stage2Answer[]) {
  let correctCount = 0

  for (const answer of answers) {
    const caseItem = stage2Cases.find((item) => item.id === answer.caseId)

    if (caseItem && caseItem.correctAnswerId === answer.selectedAnswerId) {
      correctCount++
    }
  }

  const score = correctCount * 20

  return {
    score,
    correctCount,
    wrongCount: stage2Cases.length - correctCount,
    totalCases: stage2Cases.length,
    isPerfect: correctCount === stage2Cases.length,
  }
}