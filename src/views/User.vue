<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import type { CharacterSearchResult, UserResponse } from '@/types/response'
import { getUser, getUserCharacters, searchCharacter } from '@/utils/api'
import CONFIG from '@/config'
import { useLogto } from '@logto/vue'
import CharacterCard from '@/components/character_card.vue'
import { Loader2 } from 'lucide-vue-next'
import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev
} from '@/components/ui/pagination'
import { Button } from '@/components/ui/button'

const { getAccessToken } = useLogto()
const route = useRoute()

const user = ref<UserResponse | null>(null)
const loading = ref(false)
const characters = ref<CharacterSearchResult[]>([])

const totalPages = ref(0)
const nowPage = ref(1)

const load = async () => {
  loading.value = true
  const uid = route.params['uid'] as string
  const token = await getAccessToken(CONFIG.API.ENDPOINT)
  user.value = await getUser(token!, uid)
  const data = await getUserCharacters(token!, uid, nowPage.value - 1)
  characters.value = data.result
  totalPages.value = data.total_pages
  loading.value = false
}

onMounted(async () => {
  await load()
})
</script>

<template>
  <div class="flex w-full flex-col p-4 gap-4" v-if="user">
    <div class="flex-row h-64 items-center justify-center content-center">
      <div class="flex items-center justify-start gap-6 p-14 triangle-bg">
        <Avatar class="w-32 h-32">
          <AvatarImage :src="user.picture" />
          <AvatarFallback>{{ (user.nickname || user.name)[0] }}</AvatarFallback>
        </Avatar>
        <div class="flex flex-col text-white">
          <h1 class="text-4xl font-bold">{{ user.nickname || user.name }}</h1>
          <span class="text-gray-200 text-sm">@{{ user.id }}</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Loader2 v-if="loading" class="animate-spin" />
      <template v-else>
        <CharacterCard
          class="shadow-none transition-shadow duration-200 hover:shadow-lg hover:shadow-gray-300 dark:hover:shadow-black"
          v-for="i in characters"
          :key="i.id"
          :data="i"
        />
      </template>
    </div>

    <Pagination
      v-slot="{ page }"
      :total="totalPages"
      :sibling-count="1"
      show-edges
      :default-page="1"
      v-model="nowPage"
      v-if="characters!.length > 0"
    >
      <PaginationList v-slot="{ items }" class="flex items-center gap-1">
        <PaginationFirst />
        <PaginationPrev />

        <template v-for="(item, index) in items">
          <PaginationListItem v-if="item.type === 'page'" :key="index" :value="item.value" as-child>
            <Button class="w-10 h-10 p-0" :variant="item.value === page ? 'default' : 'outline'">
              {{ item.value }}
            </Button>
          </PaginationListItem>
          <PaginationEllipsis v-else :key="item.type" :index="index" />
        </template>

        <PaginationNext />
        <PaginationLast />
      </PaginationList>
    </Pagination>

  </div>
</template>

<style scoped lang="scss">
.triangle-bg {
  position: relative;
  background-image: linear-gradient(to right, #2563eb, #22d3ee);
  clip-path: polygon(0% 0%, 0% 100%, 45% 100%, 46% 95%, 54% 95%, 55% 100%, 100% 100%, 100% 0%, 0% 0%, 0% 100%);
  border-radius: 20px;
}
</style>