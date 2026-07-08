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
  const { data, error } = await supabase.from("players").select()

  if (error) throw error

  return ((data as Player[]) ?? []).sort(comparePlayersByRank)
}

export async function setPlayerStartTime(playerId: string, startTime: number): Promise<Player> {
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

  if (finishTime !== undefined) {
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

function comparePlayersByRank(first: Player, second: Player): number {
  const scoreDifference = second.score - first.score
  if (scoreDifference !== 0) return scoreDifference

  const firstDuration = getRankDuration(first)
  const secondDuration = getRankDuration(second)
  if (firstDuration !== secondDuration) return firstDuration - secondDuration

  return (first.finish_time ?? Number.MAX_SAFE_INTEGER) - (second.finish_time ?? Number.MAX_SAFE_INTEGER)
}

function getRankDuration(player: Player): number {
  return getElapsedMilliseconds(player.start_time, player.finish_time) ?? Number.MAX_SAFE_INTEGER
}
