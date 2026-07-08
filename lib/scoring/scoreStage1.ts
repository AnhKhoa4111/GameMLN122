import { stage1TimelineItems } from "@/lib/data/stage1Timeline"

export function scoreStage1(orderedIds: string[]) {
  const correctOrder = [...stage1TimelineItems]
    .sort((a, b) => a.correctOrder - b.correctOrder)
    .map((item) => item.id)

  let wrongCount = 0

  for (let index = 0; index < correctOrder.length; index++) {
    if (orderedIds[index] !== correctOrder[index]) {
      wrongCount++
    }
  }

  const score = wrongCount === 6 ? 0 : 100 - wrongCount * 10

  return {
    score,
    wrongCount,
    correctCount: 6 - wrongCount,
    isPerfect: wrongCount === 0,
  }
}