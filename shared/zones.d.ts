export type ZoneId = 1 | 2 | 3 | 4 | 5 | 6 | 7
export type ZoneEmblem = 'compass' | 'craft' | 'knowledge' | 'empower' | 'resources' | 'build' | 'repair'

export type Zone = {
  id: ZoneId
  name: string
  description: string
  inDepth: string
  example: string
  askYourself: string
  distinction: string
  signal: string
  color: string
  emblem: ZoneEmblem
}

export const zones: readonly Zone[]
