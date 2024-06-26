<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import NavSide from '@/components/nav_side.vue'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

const route = useRoute()

/*
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
}
*/

//document.documentElement.classList.add('dark')
</script>

<template>
  <RouterView
    v-if="route.name === 'RequireLogin' || route.name === 'AuthCallback' || !route.name"
  />
  <div class="flex flex-1 h-full" v-else>
    <NavSide />
    <ScrollArea class="flex-1 h-full">
      <RouterView />
      <footer class="text-center text-sm mt-6 mb-5">
        <p class="font-bold">&copy;Replica by <a href="https://psykura.one" target="_blank">Psykura Lab</a></p>
        <p>目前有的问题请来QQ群聊：961342365</p>
      </footer>
    </ScrollArea>
  </div>
</template>

<style lang="scss">
#app {
  height: 100vh;
}

::-webkit-scrollbar {
  width: 2.5px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
