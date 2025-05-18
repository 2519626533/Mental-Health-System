<script setup lang="ts">
defineProps<{
  title: string
  value: number | string
  icon: string
  loading: boolean
}>()
</script>

<template>
  <el-card class="overview-card shadow-md border-0 rounded-2xl" body-style="padding: 20px">
    <div class="flex justify-between items-center">
      <div>
        <p class="text-gray-500 text-sm mb-2">{{ title }}</p>
        <h2 v-if="!loading" class="text-3xl font-bold text-#86F6BB">{{ value }}</h2>
        <el-skeleton v-else :rows="2" animated />
      </div>
      <el-avatar :icon="icon" size="large" style="background-color: #86F6BB; color: white" />
    </div>
  </el-card>
</template>
