const DEFAULT_GAME_DURATION_MINUTES = 20

const durationMinutes = Number(
  process.env.NEXT_PUBLIC_GAME_DURATION_MINUTES ?? DEFAULT_GAME_DURATION_MINUTES
)

export const GAME_DURATION_MINUTES =
  Number.isFinite(durationMinutes) && durationMinutes > 0
    ? durationMinutes
    : DEFAULT_GAME_DURATION_MINUTES

export const GAME_DURATION_MS = GAME_DURATION_MINUTES * 60 * 1000
