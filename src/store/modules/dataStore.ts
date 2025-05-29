import type { Student } from '@/types/student'
import { deleteSclRecordAPI, fetchAllSclAPI, updateSclRecordAPI } from '@/apis'
import { ElMessage } from 'element-plus'
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
  // 移除paginatedStudents（getter不应作为state）
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
          this.currentPage = 1
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
          item => item.name?.toLowerCase().includes(query)
            || (item.id?.toString().includes(query) ?? false),
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

      // 更新分页数据
      this.filteredStudents = result
      this.total = result.length
      this.paginate()
    },

    // 分页处理（不再直接修改getter）
    paginate() {
      // getter会自动处理分页，无需手动设置
    },

    // 更新搜索查询
    setSearchQuery(query: string) {
      this.searchQuery = query
      this.currentPage = 1
      this.applyFilters()
    },

    // 设置筛选条件
    setFilters(filters: { dateRange: string[] }) {
      this.filters = {
        dateRange: filters.dateRange || [],
      }
      this.currentPage = 1
      this.applyFilters()
    },

    // 设置当前页码
    setCurrentPage(page: number) {
      this.currentPage = page
      this.paginate() // 调用空的paginate方法
    },

    // 设置每页数量
    setPageSize(size: number) {
      this.pageSize = size
      this.currentPage = 1
      this.paginate() // 调用空的paginate方法
    },
    // 删除学生
    async deleteStudent(id: number) {
      try {
        const res = await deleteSclRecordAPI(id)

        if (res.data.code === 1) {
          this.students = this.students.filter(s => s.id !== id)
          this.applyFilters()
          ElMessage({
            type: 'success',
            message: '删除成功',
          })
        } else {
          ElMessage({
            type: 'warning',
            message: res.data.msg || '删除失败',
          })
        }
      } catch (error) {
        console.error('删除异常:', error)
        ElMessage({
          type: 'error',
          message: '删除异常，请重试',
        })
      }
    },
    // 更新学生数据
    async updateStudent(student: Student) {
      try {
        const res = await updateSclRecordAPI(student)

        if (res.data.code === 1) {
          const index = this.students.findIndex(s => s.id === student.id)
          if (index !== -1) {
            this.students[index] = student
          } else {
            this.students.push(student)
          }
          this.applyFilters()
          ElMessage({
            type: 'success',
            message: '更新成功',
          })
        } else {
          ElMessage({
            type: 'warning',
            message: res.data.msg || '更新失败',
          })
        }
      } catch (error) {
        console.error('更新异常:', error)
        ElMessage({
          type: 'error',
          message: '更新失败',
        })
      }
    },
  },
  getters: {
    // 移除paginatedStudents getter
    paginatedStudents: (state) => {
      const start = (state.currentPage - 1) * state.pageSize
      return state.filteredStudents.slice(start, start + state.pageSize)
    },
  },
})
