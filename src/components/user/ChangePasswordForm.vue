<script setup lang="ts">
import { useUserStore } from '@/store'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const form = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

// 表单验证
const validateForm = (): boolean => {
  if (!form.value.newPassword || !form.value.confirmPassword) {
    ElMessage.error('请输入新密码')
    return false
  }

  if (form.value.newPassword !== form.value.confirmPassword) {
    ElMessage.error('两次输入的密码不一致')
    return false
  }

  if (form.value.newPassword.length < 6) {
    ElMessage.error('密码至少6位')
    return false
  }

  return true
}

// 提交修改
const submitForm = async () => {
  if (!validateForm())
    return

  try {
    // 调用真实API
    await userStore.changePassword(form.value.oldPassword, form.value.newPassword)
    ElMessage.success('密码修改成功')

    // 重置表单
    form.value = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
    userStore.logout()
    router.push('/login')
  } catch (error: any) {
    ElMessage.error(error.message || '密码修改失败')
  }
}
</script>

<template>
  <el-card class="password-form shadow-md border-0 rounded-2xl">
    <h3 class="mb-4 text-lg font-bold">修改密码</h3>
    <el-form :model="form" label-width="120px" label-position="left">
      <!-- 原密码 -->
      <el-form-item label="原密码">
        <el-input v-model="form.oldPassword" placeholder="输入原密码" type="password" show-password />
      </el-form-item>

      <!-- 新密码 -->
      <el-form-item label="新密码">
        <el-input v-model="form.newPassword" placeholder="输入新密码" type="password" show-password />
      </el-form-item>

      <!-- 确认密码 -->
      <el-form-item label="确认密码">
        <el-input
          v-model="form.confirmPassword"
          placeholder="确认新密码"
          type="password"
          show-password
        />
      </el-form-item>

      <!-- 提交按钮 -->
      <el-form-item>
        <el-button color="#86F6BB" @click="submitForm">
          修改密码
        </el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
