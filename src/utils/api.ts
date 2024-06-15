/*
	rout := app.Group("api/v1")
	rout.Use(handler.AuthMiddleware)

	rout.GET("/user/me", handler.MeUser)
	rout.GET("/user/:uid", handler.GetUser)
	rout.GET("/user/:uid/characters", handler.GetUserCharacters)
	rout.GET("/character/:cid", handler.GetCharacter)
	rout.POST("/character", handler.CreateCharacter)
	rout.PUT("/character/:cid", handler.UpdateCharacter)
	rout.DELETE("/character/:cid", handler.DeleteCharacter)
	rout.GET("/character", handler.SearchCharacter)
	rout.GET("/character/tag", handler.SearchCharacterByTags)
	rout.GET("/character/trend", handler.GetTrendingCharacters)
	rout.GET("/character/random", handler.GetRandomCharacter)

	rout.POST("/chat/new/:cid", handler.NewChat)
	rout.POST("/chat/:hid", handler.Chat)
	rout.GET("/chat/:hid", handler.GetChat)
	rout.GET("/chat/history", handler.ChatHistory)
	rout.POST("/chat/:hid/regenerate", handler.RegenerateChat)
	rout.POST("/chat/:hid/feedback", handler.Feedback)
 */

import type {
  Character,
  CharacterSearchResult,
  ChatHistory,
  ChatResponse,
  PagedResult
} from '@/types/response'
import CONFIG from '@/config'

export async function getCharacter(token: string, cid: string): Promise<Character> {
  const res = await fetch(CONFIG.API.ENDPOINT + `api/v1/character/${cid}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  return await res.json()
}

export async function searchCharacter(
  token: string,
  query: string,
  page: number
): Promise<PagedResult<CharacterSearchResult>> {
  const res = await fetch(CONFIG.API.ENDPOINT + `api/v1/character?q=${query}&page=${page}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  return await res.json()
}

export async function searchCharacterByTags(
  token: string,
  tags: string[],
  page: number
): Promise<PagedResult<CharacterSearchResult>> {
  const res = await fetch(
    CONFIG.API.ENDPOINT + `api/v1/character/tag?tags=${tags.join(',tags=')}&page=${page}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    }
  )
  return await res.json()
}

export async function getTrendingCharacters(
  token: string
): Promise<PagedResult<CharacterSearchResult>> {
  const res = await fetch(CONFIG.API.ENDPOINT + `api/v1/character/trend`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  return await res.json()
}

export async function getRandomCharacter(token: string): Promise<CharacterSearchResult> {
  const res = await fetch(CONFIG.API.ENDPOINT + `api/v1/character/random`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  return await res.json()
}

export async function createCharacter(
  token: string,
  character: Record<string, any>
): Promise<string> {
  const res = await fetch(CONFIG.API.ENDPOINT + `api/v1/character`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(character)
  })
  return (await res.json())['cid']
}

export async function updateCharacter(
  token: string,
  cid: string,
  character: Record<string, any>
): Promise<Character> {
  const res = await fetch(CONFIG.API.ENDPOINT + `api/v1/character/${cid}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(character)
  })
  return await res.json()
}

export async function deleteCharacter(token: string, cid: string): Promise<void> {
  await fetch(CONFIG.API.ENDPOINT + `api/v1/character/${cid}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
}

export async function newChat(token: string, cid: string): Promise<ChatResponse> {
  const res = await fetch(CONFIG.API.ENDPOINT + `api/v1/chat/new/${cid}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  return await res.json()
}

export async function chat(token: string, hid: string, content: string): Promise<ChatResponse> {
  const res = await fetch(CONFIG.API.ENDPOINT + `api/v1/chat/${hid}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ content })
  })
  return await res.json()
}

export async function getChat(token: string, hid: string): Promise<ChatResponse> {
  const res = await fetch(CONFIG.API.ENDPOINT + `api/v1/chat/${hid}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  return await res.json()
}

export async function getChatHistory(token: string): Promise<ChatHistory[]> {
  const res = await fetch(CONFIG.API.ENDPOINT + `api/v1/chat/history`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  return await res.json()
}

export async function regenerateChat(token: string, hid: string): Promise<ChatResponse> {
  const res = await fetch(CONFIG.API.ENDPOINT + `api/v1/chat/${hid}/regenerate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  return await res.json()
}

export async function feedback(token: string, hid: string, feedback: boolean): Promise<void> {
  await fetch(CONFIG.API.ENDPOINT + `api/v1/chat/${hid}/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ feedback })
  })
}

export async function meUser(token: string): Promise<any> {
  const res = await fetch(CONFIG.API.ENDPOINT + `api/v1/user/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  return await res.json()
}

export async function getUser(token: string, uid: string): Promise<any> {
  const res = await fetch(CONFIG.API.ENDPOINT + `api/v1/user/${uid}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  return await res.json()
}

export async function getUserCharacters(
  token: string,
  uid: string
): Promise<PagedResult<CharacterSearchResult>> {
  const res = await fetch(CONFIG.API.ENDPOINT + `api/v1/user/${uid}/characters`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  return await res.json()
}
