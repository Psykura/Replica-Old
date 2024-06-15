import { defineStore } from 'pinia'
import type { Character, ChatHistory, ChatLog } from '@/types/response'

export interface ChatInfo {
  hid: string
  cid: string
  logs: ChatLog[]
  feedback: boolean
}

export const useChatStore = defineStore('chat', {
  state: () => ({
    chats: {} as Record<string, ChatInfo>,
    characters: {} as Record<string, Character>,
    history: [] as ChatHistory[]
  }),
  getters: {
    getChat: (state) => (hid: string) => {
      return state.chats[hid]
    },
    isChatExist: (state) => (hid: string) => {
      return state.chats[hid] !== undefined
    },
    isCharacterExist: (state) => (cid: string) => {
      return state.characters[cid] !== undefined
    },
    getLogs: (state) => (hid: string) => {
      return state.chats[hid].logs
    },
    getFeedback: (state) => (hid: string) => {
      return state.chats[hid].feedback
    },
    getCharacter: (state) => (cid: string) => {
      return state.characters[cid]
    },
    getCharacterFromChat: (state) => (hid: string) => {
      return state.characters[state.chats[hid].cid]
    },
    getHistory: (state) => {
      return state.history
    }
  },
  actions: {
    upsertCharacter(cid: string, character: Character) {
      this.characters[cid] = character
    },
    setHistory(history: ChatHistory[]) {
      this.history = history
    },
    appendHistory(history: ChatHistory) {
      if (this.history.length >= 50) {
        this.history.pop()
      }
      if (this.history.length > 0 && this.history[0].hid == history.hid) {
        return
      }
      this.history.unshift(history)
    },
    setHistoryMsg(hid: string, log: ChatLog) {
      const idx = this.history.findIndex((h) => h.hid === hid)
      this.history[idx].logs = [log]
    },
    addChat(hid: string, cid: string, logs: ChatLog[], feedback: boolean = false) {
      this.chats[hid] = {
        hid,
        cid,
        logs,
        feedback: feedback
      }
    },
    setLogs(hid: string, logs: ChatLog[]) {
      this.chats[hid].logs = logs
    },
    addLog(hid: string, log: ChatLog) {
      this.chats[hid].logs.push(log)
    },
    popLog(hid: string) {
      this.chats[hid].logs.pop()
    },
    refreshLogs(hid: string, log: ChatLog) {
      this.chats[hid].logs.pop()
      this.chats[hid].logs.push(log)
    },
    setFeedback(hid: string) {
      this.chats[hid].feedback = true
    },
    resetFeedback(hid: string) {
      this.chats[hid].feedback = false
    }
  }
})
