<script setup lang="ts">
import { useHandleSignInCallback } from '@logto/vue'
useHandleSignInCallback()
</script>

<template>
  <div class="loading-container">
    <p>正在重定向 ...</p>
  </div>
</template>

<style scoped lang="scss">
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  flex-direction: column;
  text-align: center;

  .loading {
    margin-bottom: 20px;
  }

  p {
    font-size: 20px;
  }
}
</style>
