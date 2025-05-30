<script setup lang="ts">
import EditDrawer from '@/components/admin/EditDrawer.vue'
import Pagination from '@/components/admin/Pagination.vue'
import SearchBar from '@/components/admin/SearchBar.vue'
import StudentTable from '@/components/admin/StudentTable.vue'
import { useDataStore } from '@/store/modules/dataStore'
import { computed, ref, watch } from 'vue'

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

// 计算当前页数据
const paginatedStudents = computed(() => {
  return dataStore.paginatedStudents
})

// 处理编辑操作
const handleEdit = (student: any) => {
  currentStudent.value = student
  drawerVisible.value = true
}

// 处理删除操作
const handleDelete = (id: number) => {
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
// 监听分页变化
watch(
  () => [dataStore.currentPage, dataStore.pageSize],
  () => {
    dataStore.setCurrentPage(dataStore.currentPage)
  },
)
</script>

<template>
  <div class="data-management p-6 bg-#F9F9F9 min-h-screen">
    <!-- 搜索与筛选 -->
    <SearchBar @search="dataStore.setSearchQuery" @filter="handleFilter" />

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
      :page-size="dataStore.pageSize"
      :current-page="dataStore.currentPage"
      @update:current-page="dataStore.setCurrentPage"
      @update:page-size="dataStore.setPageSize"
    />
  </div>
</template>
