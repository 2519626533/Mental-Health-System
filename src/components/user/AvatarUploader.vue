<script setup lang="ts">
import { useUserStore } from '@/store'
import { uploadAvatar } from '@/utils/helper'
import { computed, ref } from 'vue'

const userStore = useUserStore()
const uploading = ref(false)

// 初始化头像（使用计算属性）
const avatarUrl = computed(() => {
  return userStore.userInfo.avatar || 'https://via.placeholder.com/150 '
})

// 文件验证
const beforeUpload = (file: File) => {
  const isValidType = ['image/jpeg', 'image/png'].includes(file.type)
  const isValidSize = file.size / 1024 / 1024 < 2

  if (!isValidType) {
    alert('只能上传JPG/PNG文件！')
    return false
  }

  if (!isValidSize) {
    alert('文件大小不能超过2MB！')
    return false
  }

  return true
}

// 处理上传
const handleUpload = async (file: File) => {
  uploading.value = true

  try {
    // 上传头像
    await uploadAvatar(file)

    // 创建预览URL
    const newAvatarUrl = URL.createObjectURL(file)

    // 更新store
    userStore.updateAvatar(newAvatarUrl)
  } finally {
    uploading.value = false
  }
}
</script>

<template>
  <el-card class="avatar-card shadow-md border-0 rounded-2xl">
    <div class="flex items-center gap-4">
      <!-- 头像预览 -->
      <img :src="avatarUrl" alt="用户头像" class="w-16 h-16 rounded-full object-cover">

      <!-- 上传组件 -->
      <el-upload
        action="#"
        :show-file-list="false"
        :before-upload="beforeUpload"
        :on-success="handleUpload"
        :loading="uploading"
        class="ml-auto"
      >
        <el-button color="#86F6BB" size="small">
          {{ uploading ? '上传中...' : '修改头像' }}
        </el-button>
      </el-upload>
    </div>
  </el-card>
</template>
