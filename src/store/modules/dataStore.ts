import type { Student } from '@/types/student'
import { fetchAllSclAPI } from '@/apis'
// store/dataStore.ts
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
    filters: {
      dateRange: [],
    },
    currentPage: 1,
    pageSize: 10,
    total: 0,
  }),

  actions: {
    // 加载真实数据
    async loadMockData() {
      this.loading = true
      try {
        const res = await fetchAllSclAPI()

        if (res.data.code === 1) {
          this.students = res.data.data
          this.total = res.data.data.length
          this.applyFilters()
        } else {
          console.error('数据加载失败:', res.data.msg)
        }
      } catch (error) {
        console.error('请求失败:', error)
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
            || item.student_id.toString().includes(query),
        )
      }

      // 日期范围过滤
      if (this.filters.dateRange?.length === 2) {
        const [startDate, endDate] = this.filters.dateRange
        result = result.filter((item) => {
          const testDate = new Date(item.test_date).getTime()
          const start = new Date(startDate).getTime()
          const end = new Date(endDate).getTime()
          return testDate >= start && testDate <= end
        })
      }

      // 应用分页
      this.filteredStudents = result
      this.total = result.length
    },

    // 设置筛选条件
    setFilters(filters: { dateRange: string[] }) {
      this.filters = {
        dateRange: filters.dateRange || [],
      }
      this.currentPage = 1
      this.applyFilters()
    },
  },
  getters: {
    paginatedStudents: (state) => {
      const start = (state.currentPage - 1) * state.pageSize
      return state.filteredStudents.slice(start, start + state.pageSize)
    },
  },
})
