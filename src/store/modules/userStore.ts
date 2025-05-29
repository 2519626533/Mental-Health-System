import type { IUserInfo } from '@/types/user'
import {
  fetchUserInfoAPI,
  logoutAPI,
  updateAvatarAPI,
  updateBaseInfoAPI,
  updatePasswordAPI,
} from '@/apis'
// store/userStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 从localStorage恢复状态
  const storedInfo = localStorage.getItem('userInfo')
  const storedToken = localStorage.getItem('token')

  // 基础信息
  const userInfo = ref<IUserInfo>(storedInfo
    ? JSON.parse(storedInfo)
    : {
        account: '',
        password: '',
        name: '',
        email: '',
        avatar: 'https://via.placeholder.com/150',
        role: 'student',
        isAuthenticated: false,
      },
  )
  const token = ref<string>(storedToken || '')

  // 更新基础信息
  const updateInfo = (initInfo: Partial<IUserInfo>) => {
    const updated = {
      ...userInfo.value,
      ...initInfo,
      isAuthenticated: true,
    }
    userInfo.value = updated
    localStorage.setItem('userInfo', JSON.stringify(updated))
  }
  // 更新token
  const updateToken = (initToken: string) => {
    token.value = initToken
    localStorage.setItem('token', token.value)
  }

  // 获取用户信息
  const loadUserInfo = async () => {
    try {
      const res = await fetchUserInfoAPI()
      if (res.data.code === 1) {
        const role = res.data.data.role === '1' ? 'admin' : 'student'
        updateInfo({
          ...res.data.data,
          role,
        })
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
    }
  }

  // 更新头像
  const updateAvatar = async (avatarUrl: string) => {
    // 调用真实API
    const res = await updateAvatarAPI(avatarUrl)

    if (res.data.code === 1) {
      // 更新store
      updateInfo({ avatar: avatarUrl })
      return avatarUrl
    }

    throw new Error(res.data.msg || '头像更新失败')
  }

  // 修改信息
  const updateProfile = async (name: string, email: string) => {
    // 调用真实API
    const res = await updateBaseInfoAPI({ username: name, email })

    if (res.data.code === 1) {
      // 更新store
      updateInfo({
        name,
        email,
      })
      return true
    }

    throw new Error(res.data.msg || '信息更新失败')
  }

  // 修改密码
  const changePassword = async (oldPassword: string, newPassword: string) => {
    if (oldPassword !== userInfo.value.password) {
      throw new Error('原密码不正确')
    }

    if (newPassword.length < 6) {
      throw new Error('密码至少6位')
    }

    // 调用真实API
    const res = await updatePasswordAPI({
      old_password: oldPassword,
      new_password: newPassword,
      confirm_password: newPassword,
    })

    if (res.data.code === 1) {
      // 更新store
      updateInfo({ password: newPassword })
      return true
    }

    throw new Error(res.data.msg || '密码修改失败')
  }

  // 退出登录
  const logout = async () => {
    try {
      // 调用真实API
      await logoutAPI()
    } finally {
      // 清除本地状态
      userInfo.value = {
        account: '',
        password: '',
        name: '',
        email: '',
        avatar: '',
        role: 'student',
        isAuthenticated: false,
      }
      token.value = ''
      localStorage.removeItem('userInfo')
      localStorage.removeItem('token')
    }
  }

  return {
    userInfo,
    token,
    updateInfo,
    updateToken,
    updateAvatar,
    updateProfile,
    changePassword,
    logout,
    loadUserInfo,
  }
})
