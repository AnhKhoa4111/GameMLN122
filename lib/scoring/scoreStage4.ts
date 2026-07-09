import { stage4CompanyCases, type Stage4DecisionAnswer } from "@/lib/data/stage4Decisions"


export function scoreStage4(answers: Record<string, Stage4DecisionAnswer>) {
  const correctCount = stage4CompanyCases.reduce((total, companyCase) => {
    return total + (answers[companyCase.id] === companyCase.correctAnswer ? 1 : 0)
  }, 0)


  const isPerfect = correctCount === stage4CompanyCases.length
  const score = correctCount * 30 + (isPerfect ? 10 : 0)


  return {
    score,
    correctCount,
    wrongCount: stage4CompanyCases.length - correctCount,
    totalCases: stage4CompanyCases.length,
    isPerfect,
  }
}
