<script setup lang="ts">
import { useLogto } from '@logto/vue'
import { Button } from '@/components/ui/button'
import CONFIG from '@/config'
import { useRoute } from 'vue-router'
import { ref } from 'vue'
import { Loader2 } from 'lucide-vue-next'
const { signIn } = useLogto()

const loading = ref(false)
const route = useRoute()

const onClickSignIn = () => {
  loading.value = true
  let postRedir = route.query['return']
  if (!postRedir) {
    postRedir = CONFIG.WEB.ENDPOINT
  }
  signIn({
    // @ts-ignore
    redirectUri: `${CONFIG.WEB.ENDPOINT}auth/callback`,
    postRedirectUri: postRedir,
    prompt: 'consent'
  })
}
</script>

<template>
  <div class="relative min-h-screen flex flex-col items-center justify-center overflow-hidden p-4">
    <div class="text-center z-10">
      <h1 class="text-4xl font-bold mb-4">Replica</h1>
      <p class="text-lg mb-4">登录以开启你的旅程</p>
      <Button @click="onClickSignIn" :disabled="loading"
        ><Loader2 class="w-4 h-4 mr-2 animate-spin" v-if="loading" />登录</Button
      >
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
