import type { UserInfo } from '@/types/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<UserInfo>({
    account: '',
    password: '',
  })
  const token = ref<string>('')

  // 更新
  const updateInfo = (initInfo: UserInfo) => {
    userInfo.value = initInfo
  }
  const updateToken = (initToken: string) => {
    token.value = initToken
  }

  return {
    userInfo,
    updateInfo,
    updateToken,
  }
})
