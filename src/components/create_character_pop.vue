<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import CreateCharacter from '@/components/create_character.vue'
import { BookUser } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <slot></slot>
    </PopoverTrigger>
    <PopoverContent class="w-40 p-1">
      <div class="flex flex-col gap-2">
        <Dialog>
          <DialogTrigger as-child>
            <Button variant="ghost"><BookUser class="w-4 h-4 mr-2" />
             创建角色</Button>
          </DialogTrigger>
          <DialogContent class="p-0">
            <DialogHeader class="pl-6 pr-6 pt-6">
              <DialogTitle>角色信息表</DialogTitle>
            </DialogHeader>
            <div class="max-h-[calc(100vh-6.25rem)] pl-4 pr-4 pb-6 overflow-y-auto">
              <CreateCharacter class="ml-2 mr-2" />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PopoverContent>
  </Popover>
</template>

<style scoped lang="scss"></style>
