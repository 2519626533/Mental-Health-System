<script setup lang="ts">
import type { Student } from '@/types/student'
import { defineEmits, defineProps } from 'vue'

const props = defineProps<{
  data: Student[]
  loading: boolean
}>()

const emit = defineEmits(['edit', 'delete'])
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
      <el-table-column prop="studentId" label="学生ID" width="180">
        <template #default="{ row }">
          <el-tag type="info" size="small">{{ row.studentId }}</el-tag>
        </template>
      </el-table-column>

      <!-- 姓名 -->
      <el-table-column prop="name" label="姓名" width="120">
        <template #default="{ row }">
          <span class="font-medium">{{ row.name }}</span>
        </template>
      </el-table-column>

      <!-- 测试时间 -->
      <el-table-column prop="testDate" label="测试时间" width="160">
        <template #default="{ row }">
          <el-tag type="success" size="small">
            {{ new Date(row.testDate).toLocaleDateString() }}
          </el-tag>
        </template>
      </el-table-column>

      <!-- SCL-90总分 -->
      <el-table-column prop="totalScore" label="总分" width="100">
        <template #default="{ row }">
          <el-rate
            v-model="row.totalScore"
            disabled
            :colors="['#2FD2FE', '#86F6BB', '#86F6BB']"
            :max="5"
            disabled-void-color="#bbb"
          />
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column label="操作" fixed="right" width="120">
        <template #default="{ row }">
          <div class="flex gap-2">
            <el-button size="small" text @click="emit('edit', row)">
              编辑
            </el-button>
            <el-button size="small" text type="danger" @click="emit('delete', row.studentId)">
              删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
