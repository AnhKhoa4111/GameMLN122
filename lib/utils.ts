export function formatClockTime(timestamp: number | null): string {
  if (!timestamp) return "Chưa có"
  return new Date(timestamp).toLocaleTimeString("vi-VN")
}

export function getElapsedMilliseconds(startTime: number | null, finishTime: number | null): number | null {
  if (!startTime || !finishTime || finishTime < startTime) return null
  return finishTime - startTime
}

export function formatDurationMinutes(startTime: number | null, finishTime: number | null): string {
  const elapsedMilliseconds = getElapsedMilliseconds(startTime, finishTime)

  if (elapsedMilliseconds === null) return "Chưa xong"

  const minutes = Math.max(1, Math.ceil(elapsedMilliseconds / 60_000))
  return `${minutes} phút`
}
