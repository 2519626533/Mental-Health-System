// Pagination.vue 改进
<script setup lang="ts">
import { defineEmits, defineProps, ref, watch } from 'vue'

// 定义props
const props = defineProps<{
  total: number
  pageSize: number
  currentPage: number
  pageSizes?: number[]
}>()

// 定义emit
const emit = defineEmits<{
  (e: 'update:current-page', page: number): void
  (e: 'update:page-size', size: number): void
  (e: 'change', page: { currentPage: number, pageSize: number }): void
}>()

// 本地状态
const localCurrentPage = ref(props.currentPage)
const localPageSize = ref(props.pageSize)

// 同步props变化
watch(() => props.currentPage, (newVal) => {
  localCurrentPage.value = newVal
})

watch(() => props.pageSize, (newVal) => {
  localPageSize.value = newVal
})

// 处理页码变化
const handleCurrentChange = (currentPage: number) => {
  localCurrentPage.value = currentPage
  emit('update:current-page', currentPage)
  emit('change', { currentPage, pageSize: localPageSize.value })
}

// 处理每页数量变化
const handleSizeChange = (pageSize: number) => {
  localPageSize.value = pageSize
  emit('update:page-size', pageSize)
  emit('change', { currentPage: 1, pageSize })
}
</script>

<!-- Pagination.vue 模板改进 -->
<template>
  <div class="pagination flex justify-center mt-6">
    <el-pagination
      v-model:current-page="localCurrentPage"
      v-model:page-size="localPageSize"
      :page-sizes="pageSizes || [10, 20, 30, 50]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      :background="true"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    >
      <template #default>
        <span class="text-sm text-gray-500">共 {{ total }} 条数据</span>
      </template>
    </el-pagination>
  </div>
</template>
