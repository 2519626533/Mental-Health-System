import type { UserInfo } from '@/types/user'
import request from '@/utils/request'

// 注册接口
export const userRegisterAPI = (data: UserInfo) =>
  request.post('/admin/register', data)

// 登录接口
export const userLoginAPI = (data: UserInfo) =>
  request.post('/admin/login', data)
