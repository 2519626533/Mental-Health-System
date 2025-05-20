import type { Student } from '@/types/student'
import { generateMockData } from '@/utils/helper'
import { defineStore } from 'pinia'

interface StudentState {
  students: Student[]
  filteredStudents: Student[]
  loading: boolean
  searchQuery: string
  filters: {
    dateRange: string[]
  }
  currentPage: number
  pageSize: number
  total: number
}

export const useDataStore = defineStore('data', {
  state: (): StudentState => ({
    students: [],
    filteredStudents: [],
    loading: false,
    searchQuery: '',
    filters: { dateRange: [] },
    currentPage: 1,
    pageSize: 10,
    total: 0,
  }),

  actions: {
    // 加载mock数据
    loadMockData() {
      this.loading = true
      try {
        const mockData = generateMockData()
        this.students = mockData.testRecords
        this.total = mockData.testRecords.length
        this.applyFilters()
      } finally {
        this.loading = false
      }
    },

    // 应用所有过滤条件
    applyFilters() {
      let result = [...this.students]

      // 搜索过滤
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        result = result.filter(
          item => item.name.toLowerCase().includes(query)
            || item.studentId.includes(query),
        )
      }

      // 日期范围过滤
      if (this.filters.dateRange?.length === 2) {
        const [startDate, endDate] = this.filters.dateRange
        result = result.filter(
          item => item.testDate >= startDate && item.testDate <= endDate,
        )
      }

      this.filteredStudents = result
      this.total = result.length
    },

    // 更新学生数据
    updateStudent(updatedStudent: Student) {
      const index = this.students.findIndex(
        s => s.studentId === updatedStudent.studentId,
      )
      if (index !== -1) {
        this.students[index] = updatedStudent
        this.applyFilters()
      }
    },

    // 删除学生
    deleteStudent(studentId: string) {
      this.students = this.students.filter(
        s => s.studentId !== studentId,
      )
      this.applyFilters()
    },

    // 设置搜索查询
    setSearchQuery(query: string) {
      this.searchQuery = query
      this.applyFilters()
    },

    // 设置筛选条件
    setFilters(filters: { dateRange: string[] }) {
      this.filters = filters
      this.applyFilters()
    },

    // 设置当前页码
    setPage(page: number) {
      this.currentPage = page
      this.applyFilters()
    },

    // 设置每页数量
    setPageSize(size: number) {
      this.pageSize = size
      this.currentPage = 1
      this.applyFilters()
    },
  },
})
