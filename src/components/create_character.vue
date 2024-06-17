<script setup lang="ts">
import * as z from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText
} from '@/components/ui/tags-input'
import { ref, watch } from 'vue'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, Send } from 'lucide-vue-next'
import ChatContent from '@/components/chat_content.vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { createCharacter } from '@/utils/api'
import CONFIG from '@/config'
import { useLogto } from '@logto/vue'
import { useRouter } from 'vue-router'

const { getAccessToken } = useLogto()

const formSchema = toTypedSchema(
  z.object({
    name: z
      .string({ required_error: '必须填写' })
      .min(2, '名字长度必须大于 2')
      .max(20, '名字长度必须小于 20'),
    greeting: z
      .string({ required_error: '必须填写' })
      .min(2, '问候语长度不得小于 2')
      .max(50, '问候语长度不得大于 50'),
    description: z
      .string({ required_error: '必须填写' })
      .min(2, '描述长度不得小于 2')
      .max(50, '描述长度不得大于 50'),
    information: z
      .string({ required_error: '必须填写' })
      .min(2, '信息长度不得小于 2')
      .max(700, '信息长度不得大于 700'),
    dialogue_example: z.string().max(500, '对话示例长度不得大于 500').optional(),
    tags: z
      .array(
        z
          .string({ required_error: '必须填写' })
          .min(2, '标签长度不得小于 2')
          .max(20, '标签长度不得大于 20'),
        { required_error: '必须填写' }
      )
      .min(1, '至少填写一个标签')
      .max(40, '标签不得超过 40 个'),
    visibility: z.enum(['1', '2', '3'], { required_error: '必须填写' })
  })
)

const data = ref({
  name: '',
  greeting: '',
  description: '',
  information: '',
  dialogue_example: '',
  tags: [] as string[],
  visibility: '1' as '1' | '2' | '3'
})
const errorMsg = ref('')
const dialogueExample = ref<
  {
    role: string
    content: string
  }[]
>([])
const dialogueExampleInput = ref('')
const dialogueChatPerson = ref('user')
const dialogueExampleTab = ref('simple')
const router = useRouter()

const submitDialogueChat = () => {
  if (dialogueExampleInput.value) {
    dialogueExample.value.push({
      role: dialogueChatPerson.value,
      content: dialogueExampleInput.value
    })
    dialogueExampleInput.value = ''
    data.value.dialogue_example = dialogueExample.value
      .map((e) => `${e.role === 'user' ? '你' : data.value.name}: ${e.content}`)
      .join('\n')
  }
}

const convertExampleToChat = () => {
  dialogueExample.value = []
  if (data.value.dialogue_example.trim() === '') {
    return
  }
  data.value.dialogue_example
    .trim()
    .split('\n')
    .forEach((line) => {
      if (line.startsWith('你: ')) {
        dialogueExample.value.push({
          role: 'user',
          content: line.slice(3)
        })
      } else {
        dialogueExample.value.push({
          role: 'character',
          content: line.slice(`${data.value.name}: `.length)
        })
      }
    })
}

watch(dialogueExampleTab, () => {
  if (dialogueExampleTab.value === 'simple') {
    convertExampleToChat()
  } else {
    data.value.dialogue_example = dialogueExample.value
      .map((e) => `${e.role === 'user' ? '你' : data.value.name}: ${e.content}`)
      .join('\n')
  }
})

const submit = async () => {
  const parseResult = await formSchema.parse(data.value)
  if (parseResult.errors.length === 0) {
    const token = await getAccessToken(CONFIG.API.ENDPOINT)
    const request: Record<string, any> = parseResult.value!!
    request.visibility = parseInt(request.visibility)
    const cid = await createCharacter(token!, request)
    await router.push({ name: 'NewChat', params: { cid } })
  } else {
    errorMsg.value = parseResult.errors.map((e) => e.errors[0]).join('\n')
  }
}
</script>

<template>
  <div>
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <label for="name">名字</label>
        <Input type="text" placeholder="名字" v-model="data.name" />
      </div>
      <div class="flex flex-col gap-2">
        <label for="greeting">问候语</label>
        <Input type="text" placeholder="问候语" v-model="data.greeting" />
      </div>
      <div class="flex flex-col gap-2">
        <label for="description">描述</label>
        <Textarea placeholder="描述" v-model="data.description" />
      </div>
      <div class="flex flex-col gap-2">
        <label for="information">信息</label>
        <Textarea class="min-h-32" placeholder="信息" v-model="data.information" />
      </div>
      <div class="flex flex-col gap-2">
        <label for="dialogue_example">对话示例</label>
        <Tabs default-value="simple" class="w-full" v-model="dialogueExampleTab">
          <TabsList>
            <TabsTrigger value="simple"> 简易编辑 </TabsTrigger>
            <TabsTrigger value="advance"> 高级编辑 </TabsTrigger>
          </TabsList>
          <TabsContent value="simple">
            <div class="flex flex-col gap-2">
              <div class="h-72 rounded-md border overflow-y-auto">
                <ChatContent v-model="dialogueExample" class="m-4" />
              </div>
              <div class="flex w-full items-center gap-1.5">
                <Select v-model="dialogueChatPerson">
                  <SelectTrigger class="grow-0 w-36">
                    <SelectValue placeholder="选一个说话人" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="user"> “我”说话 </SelectItem>
                      <SelectItem value="character"> 角色说话 </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Input
                  type="text"
                  placeholder="输入对话"
                  v-model="dialogueExampleInput"
                  @keyup.enter.prevent="submitDialogueChat"
                  class="w-full grow"
                />
                <Button type="submit" @click="submitDialogueChat">
                  <Send class="w-4 h-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="advance">
            <Textarea
              placeholder="对话示例"
              v-model="data.dialogue_example"
              @focusout="convertExampleToChat"
              class="min-h-72"
            />
          </TabsContent>
        </Tabs>
      </div>
      <div class="flex flex-col gap-2">
        <label for="tags">标签</label>
        <TagsInput v-model="data.tags">
          <TagsInputItem v-for="item in data.tags" :key="item" :value="item">
            <TagsInputItemText />
            <TagsInputItemDelete />
          </TagsInputItem>

          <TagsInputInput placeholder="输入一些标签吧，使用回车来确认！" />
        </TagsInput>
      </div>
      <div class="flex flex-col gap-2">
        <label for="visibility">可见性</label>
        <Select v-model="data.visibility">
          <SelectTrigger>
            <SelectValue placeholder="请选择可见性" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="1">仅你可见</SelectItem>
              <SelectItem value="2">链接可用</SelectItem>
              <SelectItem value="3">公开角色</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Alert variant="destructive" v-if="errorMsg">
        <AlertCircle class="w-4 h-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription class="whitespace-pre-wrap text-wrap break-words">
          {{ errorMsg }}
        </AlertDescription>
      </Alert>
      <Button @click="submit">提交</Button>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
