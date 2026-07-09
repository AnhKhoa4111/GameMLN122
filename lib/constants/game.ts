const DEFAULT_GAME_DURATION_MINUTES = 20

const configuredGameDurationMinutes = Number(
  process.env.NEXT_PUBLIC_GAME_DURATION_MINUTES
)

export const GAME_DURATION_MINUTES =
  Number.isFinite(configuredGameDurationMinutes) &&
  configuredGameDurationMinutes > 0
    ? configuredGameDurationMinutes
    : DEFAULT_GAME_DURATION_MINUTES

export const GAME_DURATION_MS = GAME_DURATION_MINUTES * 60 * 1000
