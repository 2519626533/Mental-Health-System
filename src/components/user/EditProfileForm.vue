<script setup lang="ts">
import { useUserStore } from '@/store'
import { updateProfile } from '@/utils/helper'
import { computed, ref } from 'vue'

const userStore = useUserStore()
const form = ref({
  name: computed(() => userStore.userInfo.name || ''),
  email: computed(() => userStore.userInfo.email || ''),
})
const submitting = ref(false)

// 表单验证
const validateForm = () => {
  // 邮箱验证
  const emailRegex = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/
  if (form.value.email && !emailRegex.test(form.value.email)) {
    alert('请输入有效的邮箱地址')
    return false
  }

  // 名称验证
  if (!form.value.name?.trim()) {
    alert('用户名不能为空')
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
    // 调用API
    await updateProfile({
      account: userStore.userInfo.account,
      password: userStore.userInfo.password,
      name: form.value.name,
      email: form.value.email,
    })

    // 更新store
    userStore.updateInfo({
      name: form.value.name,
      email: form.value.email,
    })

    alert('更新成功')
  } catch (error: any) {
    alert(`更新失败: ${error.message}`)
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
