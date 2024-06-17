<script setup lang="ts">
import { ref } from 'vue'
import CONFIG from '@/config'
import { useLogto } from '@logto/vue'
import { getTrendingCharacters } from '@/utils/api'
import CharacterCard from '@/components/character_card.vue'
import type { CharacterSearchResult } from '@/types/response'
import { Separator } from '@/components/ui/separator'
import { Loader2, Plus } from 'lucide-vue-next'
import CreateCharacterPop from '@/components/create_character_pop.vue'
import { Button } from '@/components/ui/button'

const { isAuthenticated, getAccessToken } = useLogto()

const trendingCharacters = ref<CharacterSearchResult[]>()
const recommendedCharacters = ref<CharacterSearchResult[]>()

recommendedCharacters.value = [
  {"id":"6657425187850aef1c103e83","name":"珞璃","greeting":"哇，又见到主人了呢，好开心！主人想要和我聊些什么呢？","description":"珞璃是你的得力助手","creator":"yc2j8acnf0yn","create_time":1716994641,"visibility":3,"tags":["官方"]},
  {"id":"666911f72b021099250df322","name":"珞璎","greeting":"我一直在这里等着你呢！","description":"珞璎是你的情绪解药","creator":"yc2j8acnf0yn","create_time":1718161911,"visibility":3,"tags":["官方","心理","情感"]},
]

if (isAuthenticated.value) {
  (async () => {
    const token = await getAccessToken(CONFIG.API.ENDPOINT)
    const { result, total_pages } = await getTrendingCharacters(token!)
    trendingCharacters.value = result
  })()
}
</script>

<template>
  <div class="p-4">
    <div class="p-4">
      <div class="landing-image">
        <div class="flex items-center content-center justify-between p-16 h-full">
          <div class="flex flex-col">
            <h1 class="text-4xl font-bold text-white">Replica 制酱工厂</h1>
            <p class="text-white">你所触碰的是虚假，亦或是真实？</p>
          </div>
          <div class="flex items-center content-center">
            <CreateCharacterPop>
              <Button variant="secondary" size="icon" class="rounded-full"
                ><Plus class="w-4 h-4" />
              </Button>
            </CreateCharacterPop>
          </div>
        </div>
      </div>
    </div>
    <div class="p-4">
      <div class="flex items-baseline gap-2">
        <h1 class="text-2xl font-bold">官方推荐</h1>
        <p class="text-gray-500">可以先试试这几个！</p>
      </div>
      <Separator class="mt-1 mb-4" />
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Loader2 v-if="!recommendedCharacters" class="animate-spin" />
        <CharacterCard
          class="shadow-none transition-shadow duration-200 hover:shadow-lg hover:shadow-gray-300 dark:hover:shadow-black"
          v-for="i in recommendedCharacters"
          :key="i.id"
          :data="i"
        />
      </div>
    </div>
    <div class="p-4">
      <div class="flex items-baseline gap-2">
        <h1 class="text-2xl font-bold">热门角色</h1>
        <p class="text-gray-500">这里是一些最近最受欢迎的角色</p>
      </div>
      <Separator class="mt-1 mb-4" />
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Loader2 v-if="!trendingCharacters" class="animate-spin" />
        <CharacterCard
          class="shadow-none transition-shadow duration-200 hover:shadow-lg hover:shadow-gray-300 dark:hover:shadow-black"
          v-for="i in trendingCharacters"
          :key="i.id"
          :data="i"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.landing-image {
  background-image: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
    url(@/assets/img/login-bg.webp);
  background-size: cover;
  background-position: top;
  height: 18rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 2rem;
}
</style>
