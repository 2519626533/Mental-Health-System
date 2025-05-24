import { changePassword, updateProfile, uploadAvatar } from '@/utils/helper'
// store/userStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

// 扩展UserInfo接口
export interface UserInfo {
  account: string
  password: string
  name?: string
  email?: string
  avatar?: string
  role?: 'admin' | 'student'
  isAuthenticated?: boolean
}

export const useUserStore = defineStore('user', () => {
  // 基础信息
  const userInfo = ref<UserInfo>({
    account: '',
    password: '',
    name: '',
    email: '',
    avatar: 'https://via.placeholder.com/150 ',
    role: 'student',
    isAuthenticated: false,
  })

  const token = ref<string>('')

  // 更新基础信息
  const updateInfo = (initInfo: Partial<UserInfo>) => {
    userInfo.value = {
      ...userInfo.value,
      ...initInfo,
    }
  }

  // 更新token
  const updateToken = (initToken: string) => {
    token.value = initToken
  }

  // 更新头像
  const updateAvatar = async (file: File) => {
    // 验证文件
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      throw new Error('只能上传JPG/PNG文件')
    }

    if (file.size > 2 * 1024 * 1024) {
      throw new Error('文件大小不能超过2MB')
    }

    // 上传并获取URL
    const avatarUrl = await uploadAvatar(file)

    // 更新状态
    updateInfo({
      avatar: avatarUrl,
      name: userInfo.value.name,
      email: userInfo.value.email,
    })

    return avatarUrl
  }

  // 修改密码
  const changePassword = async (oldPassword: string, newPassword: string) => {
    if (oldPassword !== userInfo.value.password) {
      throw new Error('原密码不正确')
    }

    if (newPassword.length < 6) {
      throw new Error('密码至少6位')
    }

    // 调用API
    await updateProfile({
      account: userInfo.value.account,
      password: newPassword,
      name: userInfo.value.name,
      email: userInfo.value.email,
    })

    // 更新状态
    updateInfo({ password: newPassword })
  }

  return {
    userInfo,
    token,
    updateInfo,
    updateToken,
    updateAvatar,
    changePassword,
  }
})
