<script setup lang="ts">
import type { Student } from '@/types/student'
import { defineEmits, defineProps, ref, watch } from 'vue'

// 定义props
const props = defineProps<{
  visible: boolean
  student: Student | null
}>()

// 定义emit
const emit = defineEmits<{
  (e: 'update:visible', visible: boolean): void
  (e: 'update:student', student: Student | null): void
  (e: 'update', student: Student): void
}>()

// 使用本地响应式状态
const localVisible = ref(props.visible)
const localStudent = ref<Student | null>(null)

// 初始化学生数据
watch(() => props.student, (newVal) => {
  if (newVal) {
    localStudent.value = {
      ...newVal,
      gender: newVal.gender === 0 ? 0 : 1,
      test_date: newVal.test_date || new Date().toISOString().split('T')[0],
    }
  } else {
    localStudent.value = null
  }
}, { immediate: true })

// 同步visible状态
watch(() => props.visible, (newVal) => {
  localVisible.value = newVal
})

// 关闭处理
const handleClose = () => {
  emit('update:visible', false)
  emit('update:student', null)
}

// 提交处理
const handleSubmit = () => {
  if (localStudent.value) {
    emit('update', localStudent.value)
    emit('update:visible', false)
  }
}

// 字段中文映射
const factorLabels = {
  somatization: '躯体化',
  obsession: '强迫症状',
  interpersonal: '人际关系敏感',
  depression: '抑郁',
  anxiety: '焦虑',
  hostility: '敌对',
  phobia: '恐怖',
  paranoia: '偏执',
  psychoticism: '精神病性',
  other: '其他(睡眠/饮食)',
}

// 有效因子字段
const validFactors = [
  'somatization',
  'obsession',
  'interpersonal',
  'depression',
  'anxiety',
  'hostility',
  'phobia',
  'paranoia',
  'psychoticism',
  'other',
]
</script>

<template>
  <el-drawer
    v-model="localVisible"
    title="编辑学生信息"
    direction="rtl"
    size="40%"
    @close="handleClose"
  >
    <el-form v-if="localStudent" :model="localStudent" label-width="120px">
      <!-- 固定字段 -->
      <el-form-item label="学生ID">
        <el-input v-model="localStudent.student_id" disabled />
      </el-form-item>

      <el-form-item label="姓名">
        <el-input v-model="localStudent.name" />
      </el-form-item>

      <el-form-item label="性别">
        <el-select v-model="localStudent.gender" class="w-full">
          <el-option label="女" :value="0" />
          <el-option label="男" :value="1" />
        </el-select>
      </el-form-item>

      <el-form-item label="年龄">
        <el-input-number v-model="localStudent.age" :min="16" :max="30" />
      </el-form-item>

      <el-form-item label="测试日期">
        <el-date-picker v-model="localStudent.test_date" type="date" placeholder="选择日期" />
      </el-form-item>

      <!-- 因子字段 -->
      <el-form-item v-for="factor in validFactors" :key="factor" :label="factorLabels[factor]">
        <el-slider v-model="localStudent[factor as keyof Student]" :min="1" :max="5" :step="0.1" />
      </el-form-item>

      <!-- 提交按钮 -->
      <div class="pt-4 flex justify-end gap-4">
        <el-button @click="emit('update:visible', false)">取消</el-button>
        <el-button type="primary" color="#86F6BB" @click="handleSubmit">
          保存
        </el-button>
      </div>
    </el-form>
  </el-drawer>
</template>
