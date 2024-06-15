export interface CharacterSearchResult {
  id: string
  name: string
  greeting: string
  description: string
  creator: string
  create_time: number
  visibility: number
  tags: string[]
}

export interface PagedResult<T> {
  result: T[]
  total_pages: number
}

export interface ChatResponse {
  hid: string
  cid: string
  logs: ChatLog[]
  err?: string
  feedbacked?: boolean
}

export interface ChatLog {
  from: number
  content: string
}

export interface CharacterStat {
  chat_count: number
  liked: number
}

export interface Character {
  id: string
  name: string
  greeting: string
  description: string
  information: string
  dialogue_example: string
  creator: string
  tags: string[]
  visibility: number
  create_time: number
  stat: CharacterStat
}

export interface ChatHistory {
  hid: string
  cid: string
  name: string
  ref?: string
  user?: string
  logs: ChatLog[]
  time?: number
}