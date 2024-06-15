import { defineStore } from 'pinia'

const DEFAULT = {
  title: 'Replica'
}

export const useSharedState = defineStore('shared', {
  state: () => ({
    title: DEFAULT.title
  }),
  getters: {
    getTitle(state) {
      return state.title
    }
  },
  actions: {
    setTitle(title: string) {
      this.title = title
    },
    resetTitle() {
      this.title = DEFAULT.title
    }
  }
})
