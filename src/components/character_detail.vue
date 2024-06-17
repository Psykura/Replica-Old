<script setup lang="ts">
import { useChatStore } from '@/stores/chat'
import { onMounted, ref } from 'vue'
import { getCharacter } from '@/utils/api'
import CONFIG from '@/config'
import { useLogto } from '@logto/vue'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

const { getAccessToken, getIdTokenClaims } = useLogto()
const chatStore = useChatStore()
const uid = ref('')
const props = defineProps<{
  cid: string
}>()

onMounted(async () => {
  const claims = await getIdTokenClaims()
  uid.value = claims!.sub
  if (!chatStore.isCharacterExist(props.cid)) {
    const token = await getAccessToken(CONFIG.API.ENDPOINT)
    const char = await getCharacter(token!, props.cid)
    chatStore.upsertCharacter(props.cid, char)
  }
})
</script>

<template>
  <div v-if="chatStore.isCharacterExist(cid)">
    <div class="flex flex-col items-center">
      <Avatar>
        <AvatarImage src="file://" />
        <AvatarFallback>{{ chatStore.getCharacterFromChat(cid).name[0] }}</AvatarFallback>
      </Avatar>
      <h1 class="text-2xl font-bold mt-4">{{ chatStore.getCharacterFromChat(cid).name }}</h1>
    </div>
    <div class="mt-4">
      <p>{{ chatStore.getCharacterFromChat(cid).description }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>