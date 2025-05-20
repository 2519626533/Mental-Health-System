export interface Student {
  studentId: string
  name: string
  gender: string
  age: number
  testDate: string
  factors: Record<string, number>
  totalScore: number
}
