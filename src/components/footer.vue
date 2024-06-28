<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<template>
  <footer class="text-center text-sm mt-6 mb-5" v-if="route.name !== 'Chat'">
    <p class="font-bold">&copy;Replica by <a href="https://psykura.one" target="_blank">Psykura Lab</a></p>
    <p>目前有的问题请来QQ群聊：961342365</p>
  </footer>
</template>

<style scoped lang="scss">

</style>