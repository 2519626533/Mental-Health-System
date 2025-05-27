// types/student.ts
export interface Student {
  id: number
  student_id: number
  name: string
  gender: number
  age: number
  test_date: string
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

// 响应类型
export interface SclRecordsResponse {
  code: number
  data: Student[]
  msg: string
}
