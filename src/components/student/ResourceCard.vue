<script setup lang="ts">
import { defineProps } from 'vue'

const { title, description, link } = defineProps<{
  title: string
  description: string
  link: string
}>()

// 定义打开链接方法
const openLink = (url: string) => {
  if (!url) {
    console.warn('无效的链接地址')
    return
  }

  try {
    window.open(url)
  } catch (error) {
    console.error('打开链接失败:', error)
  }
}
</script>

<template>
  <el-card class="resource-card shadow-md border-0 rounded-2xl hover:shadow-lg transition-shadow">
    <div class="flex flex-col h-full">
      <!-- 标题 -->
      <h3 class="text-base font-bold mb-2">{{ title }}</h3>

      <!-- 描述 -->
      <p class="text-sm text-gray-600 flex-1">{{ description }}</p>

      <!-- 查看资料按钮 -->
      <el-button class="mt-4" color="#86F6BB" @click="openLink(link)">
        查看资料
      </el-button>
    </div>
  </el-card>
</template>
