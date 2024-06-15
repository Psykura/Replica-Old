<script setup lang="ts">
const model = defineModel<{
  role: string,
  content: string,
}[]>()

const deleteLog = (i: number) => {
  model.value!.splice(i, 1)
}
</script>

<template>
  <div class="space-y-4 border-card">
    <div class="flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm" :class="{'bg-muted rounded-bl-none': content.role === 'character', 'ml-auto bg-primary text-primary-foreground rounded-br-none': content.role === 'user'}" v-for="(content, i) in model" :key="i" @contextmenu.prevent="deleteLog(i)">
      {{ content.content }}
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>