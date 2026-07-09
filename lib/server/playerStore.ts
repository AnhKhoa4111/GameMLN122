import { supabase } from "@/lib/server/supabase"
import type { Player } from "@/lib/types/player"
import { FIRST_STAGE } from "@/lib/types/stage"
import { getElapsedMilliseconds } from "@/lib/utils"

export async function createPlayer(playerName: string): Promise<Player> {
  const { data, error } = await supabase
    .from("players")
    .insert({
      player_name: playerName,
      current_stage: FIRST_STAGE,
      score: 0,
      start_time: null,
      finish_time: null,
    })
    .select()
    .single()

  if (error) throw error
  return data as Player
}

export async function getPlayer(playerId: string): Promise<Player | null> {
  const { data, error } = await supabase
    .from("players")
    .select()
    .eq("id", playerId)
    .maybeSingle()

  if (error) throw error
  return (data as Player | null) ?? null
}

export async function getPlayers(): Promise<Player[]> {
  const { data, error } = await supabase
    .from("players")
    .select()

  if (error) throw error
  return ((data as Player[]) ?? []).sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score

    const durationA = getElapsedMilliseconds(a.start_time, a.finish_time)
    const durationB = getElapsedMilliseconds(b.start_time, b.finish_time)

    if (durationA === null && durationB === null) return 0
    if (durationA === null) return 1
    if (durationB === null) return -1

    return durationA - durationB
  })
}

export async function setPlayerStartTime({
  playerId,
  startTime,
}: {
  playerId: string
  startTime: number
}): Promise<Player> {
  const { data, error } = await supabase
    .from("players")
    .update({
      start_time: startTime,
      updated_at: new Date().toISOString(),
    })
    .eq("id", playerId)
    .select()
    .single()

  if (error) throw error
  return data as Player
}

export async function updatePlayerProgress({
  playerId,
  currentStage,
  score,
  finishTime,
}: {
  playerId: string
  currentStage: number
  score: number
  finishTime?: number
}): Promise<Player> {
  const patch: Partial<Player> = {
    current_stage: currentStage,
    score,
    updated_at: new Date().toISOString(),
  }

  if (finishTime) {
    patch.finish_time = finishTime
  }

  const { data, error } = await supabase
    .from("players")
    .update(patch)
    .eq("id", playerId)
    .select()
    .single()

  if (error) throw error
  return data as Player
}

export async function resetPlayers(): Promise<void> {
  const { error } = await supabase.from("players").delete().not("id", "is", null)
  if (error) throw error
}
