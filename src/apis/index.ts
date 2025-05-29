import type {
  FileCheckResponse,
  FileUploadResponse,
  IUserInfo,
  SclRecord,
  SclRecordsResponse,
  UserBasicInfo,
  UserLoginResponse,
} from '@/types/user'
// api/index.ts
import request from '@/utils/request'

// 1. 登录接口
export const userLoginAPI = (data: IUserInfo) =>
  request.post<UserLoginResponse>('/login', data)

// 2. 用户注册
export const userRegisterAPI = (data: IUserInfo) =>
  request.post('/register', data)

// 3. 获取用户信息
export const fetchUserInfoAPI = () =>
  request.get<UserBasicInfo>('/')

// 4. 检查文件是否上传过
export const checkFileAPI = (fileId: string) =>
  request.post<FileCheckResponse>('/common/check-file', undefined, {
    params: { file_id: fileId },
  })

// 修改上传接口以支持进度回调
export const uploadFileAPI
  = (file: FormData, onUploadProgress?: (progressEvent: ProgressEvent) => void) =>
    request.post('/common/upload', file, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
    })

// 6. 解析excel
export const parseFileAPI = (fileId: string) =>
  request.post('/common/parse-file', undefined, {
    params: { file_id: fileId },
  })

// 7. 修改头像
export const updateAvatarAPI = (avatarUrl: string) =>
  request.post('/avatar', { avatar: avatarUrl })

// 8. 修改用户名/邮箱
export const updateBaseInfoAPI = (data: { username?: string, email?: string }) =>
  request.post('/base', data)

// 9. 修改密码
export const updatePasswordAPI = (data: {
  old_password: string
  new_password: string
  confirm_password: string
}) => request.post('/password', data)

// 10. 插入SCL记录
export const createSclRecordAPI = (data: SclRecord) =>
  request.post('/scl', data)

// 11. 查询当前用户SCL记录
export const fetchCurrentUserSclAPI = () =>
  request.get<SclRecordsResponse>('/scl')

// 12. 查询所有用户SCL记录
export const fetchAllSclAPI = () =>
  request.get<SclRecordsResponse>('/scl/all')

// 13. 删除SCL记录
export const deleteSclRecordAPI = (id: number) =>
  request.delete('/scl', {
    params: { id },
  })

// 14. 编辑SCL数据
export const updateSclRecordAPI = (data: SclRecord) =>
  request.post('/scl/update', data)

// 15. 退出登录
export const logoutAPI = () =>
  request.post('/logout', undefined, {
    headers: {
      'Authorization': localStorage.getItem('token'),
      'Refresh-Token': localStorage.getItem('refresh_token'),
    },
  })

// 16. 刷新令牌
export const refreshTokenAPI = () =>
  request.post('/refresh-token', undefined, {
    headers: {
      'Authorization': localStorage.getItem('token'),
      'Refresh-Token': localStorage.getItem('refresh_token'),
    },
  })
