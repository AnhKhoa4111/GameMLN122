export const STAGE_COMPLETION_SCORE = 100

export function addStageCompletionScore(currentScore: number): number {
  return currentScore + STAGE_COMPLETION_SCORE
}
