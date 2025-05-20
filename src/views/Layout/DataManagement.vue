<script setup lang="ts">
import EditDrawer from '@/components/admin/EditDrawer.vue'
import Pagination from '@/components/admin/Pagination.vue'
import SearchBar from '@/components/admin/SearchBar.vue'
import StudentTable from '@/components/admin/StudentTable.vue'
import { useDataStore } from '@/store/modules/dataStore'
import { computed, ref } from 'vue'

// 定义类型
interface FilterParams {
  dateRange?: string[] | null
  [key: string]: any
}

const dataStore = useDataStore()
const drawerVisible = ref(false)
const currentStudent = ref()

// 加载初始数据
dataStore.loadMockData()

// 分页配置
const currentPage = ref(1)
const pageSize = ref(10)

// 计算当前页数据
const paginatedStudents = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return dataStore.filteredStudents.slice(start, start + pageSize.value)
})

// 处理分页变化
const handlePageChange = (page: { currentPage: number, pageSize: number }) => {
  currentPage.value = page.currentPage
  pageSize.value = page.pageSize
}

// 加载初始数据
dataStore.loadMockData()

// 处理编辑操作
const handleEdit = (student: any) => {
  currentStudent.value = student
  drawerVisible.value = true
}

// 处理删除操作
const handleDelete = (id: string) => {
  dataStore.deleteStudent(id)
}

// 处理筛选
const handleFilter = (filters: FilterParams) => {
  // 显式处理可能的undefined情况
  if (filters.dateRange) {
    dataStore.setFilters({
      dateRange: filters.dateRange,
    })
  } else {
    dataStore.setFilters({})
  }
}
</script>

<template>
  <div class="data-management p-6 bg-#F9F9F9 min-h-screen">
    <!-- 搜索与筛选 -->
    <SearchBar
      @search="dataStore.setSearchQuery"
      @filter="handleFilter"
    />

    <!-- 数据表格 -->
    <StudentTable
      :data="paginatedStudents"
      :loading="dataStore.loading"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <!-- 编辑侧边栏 -->
    <EditDrawer
      v-model:visible="drawerVisible"
      :student="currentStudent"
      @update="dataStore.updateStudent"
    />

    <!-- 分页组件 -->
    <Pagination
      v-if="dataStore.total > 0"
      :total="dataStore.total"
      :page-size="pageSize"
      :current-page="currentPage"
      @update:current-page="currentPage = $event"
      @update:page-size="pageSize = $event"
      @change="handlePageChange"
    />
  </div>
</template>
