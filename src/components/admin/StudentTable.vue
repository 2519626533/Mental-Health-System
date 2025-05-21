<script setup lang="ts">
import type { Student } from '@/types/student'
import { defineEmits, defineProps } from 'vue'

const { data, loading } = defineProps<{
  data: Student[]
  loading: boolean
}>()
const emit = defineEmits(['edit', 'delete'])

// 根据分数颜色变化
const scoreColor = (score: number) => {
  if (score > 40)
    return '#ff4444' // 红色
  if (score > 30)
    return '#f7ba2a' // 橙色
  return '#86F6BB' // 绿色
}
</script>

<template>
  <el-card class="student-table shadow-md border-0 rounded-2xl">
    <el-table
      v-loading="loading"
      :data="data"
      style="width: 100%"
      row-key="studentId"
      :default-expand-all="false"
    >
      <!-- 学生ID -->
      <el-table-column prop="studentId" label="学生ID">
        <template #default="{ row }">
          <el-tag type="info" size="small">{{ row.studentId }}</el-tag>
        </template>
      </el-table-column>

      <!-- 姓名 -->
      <el-table-column prop="name" label="姓名">
        <template #default="{ row }">
          <span class="font-medium">{{ row.name }}</span>
        </template>
      </el-table-column>

      <!-- 测试时间 -->
      <el-table-column prop="testDate" label="测试时间">
        <template #default="{ row }">
          <el-tag type="success" size="small">
            {{ new Date(row.testDate).toLocaleDateString() }}
          </el-tag>
        </template>
      </el-table-column>

      <!-- SCL-90总分 -->
      <el-table-column label="总分">
        <template #default="{ row }">
          <!-- 进度条显示 -->
          <el-progress
            :percentage="row.totalScore"
            :stroke-width="15"
            :color="scoreColor(row.totalScore)"
            :text-inside="true"
          >
            <span class="ml-2 text-xs">{{ row.totalScore }}</span>
          </el-progress>
          <!-- 显示具体分数 -->
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column label="操作" fixed="right">
        <template #default="{ row }">
          <div class="flex gap-2">
            <el-button size="small" type="primary" @click="emit('edit', row)">
              编辑
            </el-button>
            <el-button size="small" type="danger" @click="emit('delete', row.studentId)">
              删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
