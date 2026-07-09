import {
  STAGE5_PERFECT_SCORE,
  STAGE5_POINTS_PER_CORRECT_CARD,
  stage5PolicyCards,
} from "@/lib/data/stage5Policies"


export function scoreStage5(selectedCardIds: string[]) {
  const correctIds = new Set(
    stage5PolicyCards.filter((card) => card.isCorrect).map((card) => card.id)
  )
  const correctCount = selectedCardIds.filter((cardId) => correctIds.has(cardId)).length
  const wrongCount = selectedCardIds.length - correctCount
  const isPerfect = correctCount === correctIds.size && wrongCount === 0


  return {
    score: isPerfect ? STAGE5_PERFECT_SCORE : correctCount * STAGE5_POINTS_PER_CORRECT_CARD,
    correctCount,
    wrongCount,
    isPerfect,
  }
}
