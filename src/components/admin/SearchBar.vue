<script setup lang="ts">
import { useDebounce } from '@/utils/hooks'
import { ref, watch } from 'vue'

// 定义类型
interface FilterParams {
  dateRange?: string[]
  [key: string]: any
}

// Props 和 Emits
const emit = defineEmits<{
  (e: 'search', query: string): void
  (e: 'filter', filters: FilterParams): void
}>()

// 搜索状态
const searchQuery = ref('')
const debouncedSearch = useDebounce(searchQuery.value, 300)

// 日期范围
const dateRange = ref<string[]>([])

// 监听防抖值变化
watch(() => debouncedSearch.value, (value) => {
  emit('search', value)
})

// 处理日期筛选
const handleDateChange = (value: string[]) => {
  dateRange.value = value
  emit('filter', { dateRange: value })
}

// 重置功能
const resetFilters = () => {
  searchQuery.value = ''
  dateRange.value = []
  emit('search', '')
  emit('filter', { dateRange: [] })
}
</script>

<template>
  <el-card class="search-bar mb-6 shadow-md border-0 rounded-2xl">
    <div class="flex flex-wrap gap-4 p-4">
      <!-- 搜索框 -->
      <el-input
        v-model="searchQuery"
        placeholder="学生ID/姓名"
        clearable
        class="w-60"
        prefix-icon="Search"
      />

      <!-- 日期筛选 -->
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        class="w-60"
        lang="CN"
        @change="handleDateChange"
      />

      <!-- 高级筛选（可选） -->
      <el-button class="ml-auto" color="#86F6BB" @click="resetFilters">
        重置
      </el-button>
    </div>
  </el-card>
</template>
