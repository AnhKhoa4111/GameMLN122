import { supabase } from "@/lib/server/supabase"
import type { GameState } from "@/lib/types/game"

const GAME_STATE_ID = 1

export async function getGameState(): Promise<GameState> {
  const { data, error } = await supabase
    .from("game_state")
    .select()
    .eq("id", GAME_STATE_ID)
    .maybeSingle()

  if (error) throw error
  if (data) return data as GameState

  const created = await supabase
    .from("game_state")
    .insert({
      id: GAME_STATE_ID,
      is_started: false,
      started_at: null,
    })
    .select()
    .single()

  if (created.error) throw created.error
  return created.data as GameState
}

export async function startGame(): Promise<GameState> {
  const startedAt = Date.now()

  const { data, error } = await supabase
    .from("game_state")
    .upsert({
      id: GAME_STATE_ID,
      is_started: true,
      started_at: startedAt,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw error

  const players = await supabase
    .from("players")
    .update({
      start_time: startedAt,
      updated_at: new Date().toISOString(),
    })
    .is("start_time", null)

  if (players.error) throw players.error
  return data as GameState
}

export async function resetGameState(): Promise<void> {
  const { error } = await supabase
    .from("game_state")
    .upsert({
      id: GAME_STATE_ID,
      is_started: false,
      started_at: null,
      updated_at: new Date().toISOString(),
    })

  if (error) throw error
}
