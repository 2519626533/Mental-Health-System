<script setup lang="ts">
import { useUserStore } from '@/store'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

const userStore = useUserStore()
const submitting = ref(false)

// 表单数据
const form = ref({
  name: userStore.userInfo.name || '',
  email: userStore.userInfo.email || '',
})

// 表单验证
const validateForm = (): boolean => {
  // 邮箱验证
  const emailRegex = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/
  if (form.value.email && !emailRegex.test(form.value.email)) {
    ElMessage.error('请输入有效的邮箱地址')
    return false
  }

  // 名称验证
  if (!form.value.name?.trim()) {
    ElMessage.error('用户名不能为空')
    return false
  }

  return true
}

// 提交表单
const submitForm = async () => {
  if (!validateForm())
    return

  submitting.value = true
  try {
    // 调用真实API
    await userStore.updateProfile(form.value.name, form.value.email)
    ElMessage.success('更新成功')
  } catch (error: any) {
    ElMessage.error(error.message || '更新失败')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <el-card class="profile-form shadow-md border-0 rounded-2xl">
    <h3 class="mb-4 text-lg font-bold">修改个人信息</h3>
    <el-form :model="form" label-width="100px" label-position="left">
      <!-- 用户名称 -->
      <el-form-item label="用户名称">
        <el-input v-model="form.name" placeholder="输入新名称" />
      </el-form-item>

      <!-- 邮箱 -->
      <el-form-item label="邮箱">
        <el-input v-model="form.email" placeholder="输入新邮箱" />
      </el-form-item>

      <!-- 提交按钮 -->
      <el-form-item>
        <el-button color="#86F6BB" :loading="submitting" @click="submitForm">
          保存修改
        </el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
