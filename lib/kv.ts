export interface TeamState {
  teamId: number
  teamName: string
  currentRoom: number
  completedRooms: number[]
  score: number
  hintsUsed: number
  startTime: number
  finishTime?: number
  roomTimes: Record<number, number>
  codeFragments: string[]
}

export interface GameSession {
  isActive: boolean
  startTime: number
  hostCode: string
}

const teams = new Map<number, TeamState>()
let session: GameSession | null = null

export async function getSession(): Promise<GameSession | null> {
  return session
}

export async function setSession(data: GameSession) {
  session = data
}

export async function getTeam(id: number): Promise<TeamState | null> {
  return teams.get(Number(id)) ?? null
}

export async function setTeam(id: number, data: TeamState) {
  teams.set(Number(id), data)
}

export async function getAllTeams(): Promise<TeamState[]> {
  return Array.from(teams.values())
}

export async function resetGame() {
  teams.clear()
  session = null
}