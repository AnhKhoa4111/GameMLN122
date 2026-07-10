export function getElapsedMilliseconds(
  startTime: number | null,
  finishTime: number | null
) {
  if (!startTime || !finishTime) return null
  return Math.max(finishTime - startTime, 0)
}

export function formatDurationMinutes(
  startTime: number | null,
  finishTime: number | null
) {
  const elapsed = getElapsedMilliseconds(startTime, finishTime)
  if (elapsed === null) return "Chưa hoàn thành"

  const totalSeconds = Math.floor(elapsed / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${minutes} phút ${String(seconds).padStart(2, "0")} giây`
}

export function shuffleArray<T>(array: T[]) {
  const shuffled = [...array]

  for (let index = shuffled.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1))

    const temp = shuffled[index]
    shuffled[index] = shuffled[randomIndex]
    shuffled[randomIndex] = temp
  }

  return shuffled
}