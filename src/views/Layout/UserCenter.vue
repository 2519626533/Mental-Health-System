<script setup lang="ts">
import AvatarUploader from '@/components/user/AvatarUploader.vue'
import ChangePasswordForm from '@/components/user/ChangePasswordForm.vue'
import EditProfileForm from '@/components/user/EditProfileForm.vue'
import UserInfoCard from '@/components/user/UserInfoCard.vue'
import { useUserStore } from '@/store'
import { onMounted } from 'vue'

const userStore = useUserStore()

// 页面加载时获取用户信息
onMounted(async () => {
  await userStore.loadUserInfo()
})
</script>

<template>
  <div class="user-center p-6 bg-#F9F9F9 min-h-screen">
    <el-row :gutter="20" class="mb-6">
      <!-- 用户信息 -->
      <el-col :span="8">
        <UserInfoCard />
      </el-col>
      <!-- 可编辑信息 -->
      <el-col :span="16">
        <div class="edit-section space-y-6">
          <AvatarUploader />
          <EditProfileForm />
          <ChangePasswordForm />
        </div>
      </el-col>
    </el-row>
  </div>
</template>
