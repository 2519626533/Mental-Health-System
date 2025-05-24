<script setup lang="ts">
import { useUserStore } from '@/store/modules/userStore'

const userStore = useUserStore()
</script>

<template>
  <el-card class="user-info-card shadow-md border-0 rounded-2xl text-center">
    <div class="flex flex-col items-center">
      <!-- 头像 -->
      <img
        :src="userStore.userInfo.avatar"
        alt="用户头像"
        class="w-32 h-32 rounded-full mb-4 object-cover"
      >

      <!-- 基本信息 -->
      <h2 class="text-xl font-bold mb-2">{{ userStore.userInfo.name }}</h2>
      <p class="text-gray-500 mb-4">账号：{{ userStore.userInfo.account }}</p>
      <p class="text-gray-500 mb-4">邮箱：{{ userStore.userInfo.email }}</p>

      <!-- 角色标签 -->
      <el-tag v-if="userStore.userInfo.role === 'admin'" type="success">管理员</el-tag>
      <el-tag v-else type="info">普通用户</el-tag>
    </div>
  </el-card>
</template>
