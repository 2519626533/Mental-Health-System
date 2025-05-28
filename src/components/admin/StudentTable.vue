<script setup lang="ts">
import type { Student } from '@/types/student'
import { defineEmits, defineProps } from 'vue'

const { data, loading } = defineProps<{
  data: Student[]
  loading: boolean
}>()
const emit = defineEmits(['edit', 'delete'])

// 计算总分（添加空值处理）
const calculateTotalScore = (row: Student) => {
  const factors = [
    row.somatization ?? 0,
    row.obsession ?? 0,
    row.interpersonal ?? 0,
    row.depression ?? 0,
    row.anxiety ?? 0,
    row.hostility ?? 0,
    row.phobia ?? 0,
    row.paranoia ?? 0,
    row.psychoticism ?? 0,
    row.other ?? 0,
  ]
  return factors.reduce((sum, score) => sum + score, 0).toFixed(2)
}

// 格式化日期（添加空值处理）
const formatDate = (dateStr: string) => {
  return dateStr ? new Date(dateStr).toLocaleDateString() : '未知'
}

// 性别转换（添加空值处理）
const formatGender = (gender: number) => {
  return gender === 0 ? '女' : gender === 1 ? '男' : '未知'
}

// 颜色映射
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
      row-key="id"
      :default-sort="{ prop: 'id' }"
    >
      <!-- 学生ID -->
      <el-table-column label="学生ID" prop="id" sortable>
        <template #default="{ row }">
          <el-tag type="info" size="small">{{ row.id }}</el-tag>
        </template>
      </el-table-column>

      <!-- 姓名 -->
      <el-table-column prop="name" label="姓名" sortable>
        <template #default="{ row }">
          <span class="font-medium">{{ row.name }}</span>
        </template>
      </el-table-column>

      <!-- 性别 -->
      <el-table-column label="性别" sortable>
        <template #default="{ row }">
          <el-tag :type="row.gender === 0 ? 'success' : 'warning'" size="small">
            {{ formatGender(row.gender) }}
          </el-tag>
        </template>
      </el-table-column>

      <!-- 年龄 -->
      <el-table-column label="年龄" sortable>
        <template #default="{ row }">
          <span>{{ row.age }}</span>
        </template>
      </el-table-column>

      <!-- 测试时间 -->
      <el-table-column label="测试时间" sortable>
        <template #default="{ row }">
          <el-tag type="success" size="small">
            {{ formatDate(row.test_date) }}
          </el-tag>
        </template>
      </el-table-column>

      <!-- SCL-90总分 -->
      <el-table-column label="总分" sortable>
        <template #default="{ row }">
          <!-- 计算总分 -->
          <el-progress
            :percentage="calculateTotalScore(row)"
            :stroke-width="15"
            :color="scoreColor(parseFloat(calculateTotalScore(row)))"
            :text-inside="true"
          >
            <span class="ml-2 text-xs">{{ calculateTotalScore(row) }}</span>
          </el-progress>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column label="操作" fixed="right">
        <template #default="{ row }">
          <div class="flex gap-2">
            <el-button size="small" color="#86F6BB" @click="emit('edit', row)">
              编辑
            </el-button>
            <el-button size="small" color="#ff4444" @click="emit('delete', row.student_id)">
              删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
