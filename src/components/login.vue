<script setup lang="ts">
import { ref } from 'vue';
import { useLogto } from "@logto/vue";
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import CONFIG from '@/config'
import { useRoute, useRouter } from 'vue-router'
import { Loader2 } from 'lucide-vue-next'

const route = useRoute();
const router = useRouter();

const { signIn, isAuthenticated, clearAllTokens, getIdTokenClaims } = useLogto();
const loading = ref(false);
const onClickSignIn = async () => {
  loading.value = true;
  let postRedir = route.query["return"]
  if (!postRedir) {
    postRedir = CONFIG.WEB.ENDPOINT;
  }
  await signIn({
    // @ts-ignore
    redirectUri: `${CONFIG.WEB.ENDPOINT}auth/callback`,
    postRedirectUri: postRedir,
    prompt: "consent",
    firstScreen: "signIn",
  });
}
const onClickSignOut = async () => {
  loading.value = true;
  //signOut(CONFIG.WEB.ENDPOINT);
  await clearAllTokens();
  setTimeout(async () => {
    await router.push({ name: "RequireLogin" });
  }, 300)
}

const userId = ref<string>();
const userName = ref<string>();
const userPicture = ref<string>();

if (isAuthenticated.value) {
  (async () => {
    const claims = await getIdTokenClaims();
    //const userInfo = await fetchUserInfo();
    userId.value = claims!.sub;
    userName.value = claims!.username!!;
    userPicture.value = claims!.picture!!;
  })();
}
</script>

<template>
  <div class="flex items-center w-full justify-between" v-if="isAuthenticated">
    <div class="flex items-center">
      <img v-if="userPicture" :src="userPicture" alt="Avatar" class="rounded-full w-16 h-16 mr-3 object-cover" width="64" height="64"/>
      <Skeleton v-else class="w-16 h-16 rounded-full mr-3" />
      <div class="flex flex-col">
        <h3 class="text-lg font-bold">{{ userName }}</h3>
        <p class="text-zinc-500 text-sm">{{ userId }}</p>
      </div>
    </div>
    <Button @click="onClickSignOut" variant="secondary" :disabled="loading"><Loader2 class="w-4 h-4 mr-2 animate-spin" v-if="loading" />注销</Button>
  </div>

  <div class="flex items-center justify-between" v-else>
    <div class="flex items-center">
      <Skeleton class="w-16 h-16 rounded-full mr-3" />
      <div class="flex flex-col">
        <h3 class="text-lg font-bold">未登录</h3>
      </div>
    </div>
    <Button @click="onClickSignIn" :disabled="loading"><Loader2 class="w-4 h-4 mr-2 animate-spin" v-if="loading" />登录</Button>
  </div>
</template>

<style scoped lang="scss">

</style>