<script setup lang="ts">
import { defineProps } from 'vue'

const { title, description, link } = defineProps<{
  title: string
  description: string
  link: string
}>()
</script>

<template>
  <el-card class="resource-card shadow-md border-0 rounded-2xl hover:shadow-lg transition-shadow">
    <div class="flex flex-col h-full">
      <h3 class="text-base font-bold mb-2">{{ title }}</h3>
      <p class="text-sm text-gray-600 flex-1">{{ description }}</p>
      <el-button class="mt-4" color="#86F6BB" @click="window.open(link, '_blank')">
        查看资料
      </el-button>
    </div>
  </el-card>
</template>

<style scoped>
.resource-card {
  transition: transform 0.2s ease;
}

.resource-card:hover {
  transform: translateY(-5px);
}
</style>
