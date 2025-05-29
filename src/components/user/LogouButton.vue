<script setup lang="ts">
import { logoutAPI } from '@/apis'
import { useUserStore } from '@/store'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

// 处理退出登录
const handleLogout = async () => {
  try {
    await logoutAPI()
    userStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('退出登录失败:', error)
    alert('退出登录失败，请重试')
  }
}
</script>

<template>
  <el-button color="#ff4444" @click="handleLogout">
    退出登录
  </el-button>
</template>
