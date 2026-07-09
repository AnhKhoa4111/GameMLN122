import {
  STAGE5_PERFECT_SCORE,
  STAGE5_POINTS_PER_CORRECT_CARD,
  stage5PolicyCards,
} from "@/lib/data/stage5Policies"

const STAGE5_PERFECT_MULTIPLIER = 2

export function scoreStage5(selectedCardIds: string[]) {
  const correctIds = new Set(
    stage5PolicyCards.filter((card) => card.isCorrect).map((card) => card.id)
  )

  const correctCount = selectedCardIds.filter((cardId) =>
    correctIds.has(cardId)
  ).length

  const wrongCount = selectedCardIds.length - correctCount

  const isPerfect = correctCount === correctIds.size && wrongCount === 0

  const baseScore = isPerfect
    ? STAGE5_PERFECT_SCORE
    : correctCount * STAGE5_POINTS_PER_CORRECT_CARD

  const score = isPerfect
    ? STAGE5_PERFECT_SCORE * STAGE5_PERFECT_MULTIPLIER
    : baseScore

  return {
    score,
    baseScore,
    bonusScore: isPerfect ? score - baseScore : 0,
    multiplier: isPerfect ? STAGE5_PERFECT_MULTIPLIER : 1,
    correctCount,
    wrongCount,
    isPerfect,
  }
}