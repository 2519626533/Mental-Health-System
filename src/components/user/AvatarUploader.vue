<script setup lang="ts">
import { uploadFileAPI } from '@/apis'
import { useUserStore } from '@/store'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

const userStore = useUserStore()
const uploading = ref(false)

// 初始化头像
const avatarUrl = ref(userStore.userInfo.avatar || 'https://via.placeholder.com/150')

// 文件验证
const beforeUpload = (file: File): boolean => {
  const isValidType = ['image/jpeg', 'image/png'].includes(file.type)
  const isValidSize = file.size / 1024 / 1024 < 2

  if (!isValidType) {
    ElMessage.error('只能上传JPG/PNG文件！')
    return false
  }

  if (!isValidSize) {
    ElMessage.error('文件大小不能超过2MB！')
    return false
  }

  return true
}

// 处理上传
const handleUpload = async (file: File) => {
  uploading.value = true
  try {
    // 1. 上传文件
    const formData = new FormData()
    formData.append('file', file)

    const res = await uploadFileAPI(formData)

    if (res.data.code === 1) {
      // 2. 更新头像
      const avatarUrl = res.data.data.file_path
      await userStore.updateAvatar(avatarUrl)
      ElMessage.success('头像更新成功')
    } else {
      throw new Error(res.data.msg || '文件上传失败')
    }
  } catch (error: any) {
    ElMessage.error(error.message || '头像更新失败')
  } finally {
    uploading.value = false
  }
}
</script>

<template>
  <el-card class="avatar-card shadow-md border-0 rounded-2xl">
    <div class="flex items-center gap-4">
      <!-- 头像预览 -->
      <img :src="avatarUrl" alt="用户头像" class="w-16 h-16 rounded-full object-cover" />

      <!-- 上传组件 -->
      <el-upload
        action="#"
        :show-file-list="false"
        :before-upload="beforeUpload"
        :on-success="handleUpload"
        :loading="uploading"
        class="ml-auto"
      >
        <el-button color="#86F6BB" size="small" :loading="uploading">
          {{ uploading ? '上传中...' : '修改头像' }}
        </el-button>
      </el-upload>
    </div>
  </el-card>
</template>
