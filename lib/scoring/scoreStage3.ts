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

  let score = 50

  if (flippedCount <= 4) {
    score = 100
  } else if (flippedCount === 5) {
    score = 85
  } else if (flippedCount === 6) {
    score = 70
  } else {
    score = 50
  }

  return {
    score,
    isCorrect: true,
    flippedCount,
  }
}