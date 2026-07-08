export function scoreStage3({
  flippedCount,
  selectedAnswerId,
}: {
  flippedCount: number
  selectedAnswerId: string
}) {
  const isCorrect = selectedAnswerId === "silver-lion-fund"

  if (!isCorrect) {
    return {
      score: 0,
      isCorrect: false,
      flippedCount,
    }
  }

  let score = 70

  if (flippedCount <= 4) {
    score = 100
  } else if (flippedCount <= 6) {
    score = 85
  } else {
    score = 70
  }

  return {
    score,
    isCorrect: true,
    flippedCount,
  }
}