// types/user.ts
export interface IUserInfo {
  account: string
  password: string
  username?: string
  email?: string
  avatar?: string
  role?: '1' | '2' // 1: 管理员，2: 普通用户
  studentId?: number
}

export interface UserLoginResponse {
  code: number
  msg: string
  data: {
    authentication: string
    refresh_token: string
    role: string
  }
}

export interface UserBasicInfo {
  code: number
  msg: string
  data: {
    account: string
    username: string
    email: string
    avatar: string
  }
}

export interface FileCheckResponse {
  code: number
  data: {
    Path: string
    IsExist: boolean
  }
  msg: string
}

export interface FileUploadResponse {
  code: number
  data: {
    file_id: string
    file_path: string
  }
  msg: string
}

export interface SclRecord {
  id?: number
  student_id: number
  name: string
  gender: number // 0: 女, 1: 男
  age: number
  test_date: string // YYYY-MM-DD
  somatization: number
  obsession: number
  interpersonal: number
  depression: number
  anxiety: number
  hostility: number
  phobia: number
  paranoia: number
  psychoticism: number
  other: number
}

export interface SclRecordsResponse {
  code: number
  data: SclRecord[]
  msg: string
}
