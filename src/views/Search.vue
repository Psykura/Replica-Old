<script setup lang="ts">
import { Loader2, Search } from 'lucide-vue-next'
import { Input } from '@/components/ui/input'
import { useDebounceFn } from "@vueuse/core"
import { onMounted, ref, watch } from 'vue'
import CharacterCard from '@/components/character_card.vue'
import type { CharacterSearchResult } from '@/types/response'
import { searchCharacter } from '@/utils/api'
import { useLogto } from '@logto/vue'
import { Button } from '@/components/ui/button'
import CONFIG from '@/config'
import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
} from '@/components/ui/pagination'

const { getAccessToken } = useLogto();

const searchText = ref<string>('')
const loading = ref(false)
const totalPages = ref(0)
const nowPage = ref(1)

const search = async () => {
  if (!searchText.value) {
    return
  }

  loading.value = true
  const token = await getAccessToken(CONFIG.API.ENDPOINT)
  const data = await searchCharacter(token!, searchText.value, nowPage.value - 1)
  characters.value = data.result
  totalPages.value = data.total_pages
  loading.value = false
}

const init = async () => {
  loading.value = true
  const token = await getAccessToken(CONFIG.API.ENDPOINT)
  const data = await searchCharacter(token!, "", 0)
  characters.value = data.result
  totalPages.value = data.total_pages
  loading.value = false
}

watch(searchText, useDebounceFn(search, 500))
watch(nowPage, useDebounceFn(search, 50))

const characters = ref<CharacterSearchResult[]>([])

onMounted(async () => {
  await init()
})
</script>

<template>
  <div class="p-4 flex flex-col gap-2">
    <div class="relative w-full items-center mb-2">
      <Input id="search" type="text" placeholder="输入点什么..." class="pl-10" v-model="searchText" />
      <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
        <Search class="size-6 text-muted-foreground" />
      </span>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Loader2 v-if="loading" class="animate-spin" />
      <template v-else>
        <CharacterCard class="shadow-none transition-shadow duration-200 hover:shadow-lg hover:shadow-gray-300" v-for="i in characters" :key="i.id" :data="i" />
      </template>
    </div>

    <Pagination v-slot="{ page }" :total="totalPages" :sibling-count="1" show-edges :default-page="1" v-model="nowPage" v-if="characters!.length > 0">
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

</style>