export interface Player {
  id: string
  player_name: string
  current_stage: number
  score: number
  start_time: number | null
  finish_time: number | null
  created_at: string
  updated_at: string
}
