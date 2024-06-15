<script setup lang="ts">
import { CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { defineProps } from 'vue'
defineProps<{
  data: {
    id: string
    name: string
    description: string
    tags: string[]
  }
}>()
</script>

<template>
  <RouterLink
    :to="{ name: 'NewChat', params: { cid: data.id } }"
    class="rounded-lg border bg-card text-card-foreground shadow-sm select-none cursor-pointer"
  >
    <CardHeader class="flex flex-row pb-3">
      <Avatar>
        <AvatarImage src="files://" />
        <AvatarFallback>{{ data.name[0] }}</AvatarFallback>
      </Avatar>
      <div class="ml-4 content-center">
        <CardTitle>{{ data.name }}</CardTitle>
      </div>
    </CardHeader>
    <CardContent class="pb-3">
      <p class="text-sm">{{ data.description }}</p>
    </CardContent>
    <CardFooter class="flex gap-2 flex-wrap">
      <span
        class="bg-blue-100 text-blue-800 rounded text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 whitespace-nowrap"
        v-for="(tag, i) in data.tags"
        :key="i"
        >{{ tag }}</span
      >
    </CardFooter>
  </RouterLink>
</template>

<style scoped lang="scss"></style>
