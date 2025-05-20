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
  localStudent.value = newVal ? { ...newVal } : null
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
</script>

<!-- 在模板中使用本地状态 -->
<template>
  <el-drawer
    v-model="localVisible"
    title="编辑学生信息"
    direction="rtl"
    size="40%"
    @close="handleClose"
  >
    <el-form v-if="localStudent" :model="localStudent" label-width="120px">
      <!-- 表单字段 -->
      <!-- 学生ID -->
      <el-form-item label="学生ID">
        <el-input v-model="localStudent.studentId" disabled />
      </el-form-item>

      <!-- 姓名 -->
      <el-form-item label="姓名">
        <el-input v-model="localStudent.name" />
      </el-form-item>

      <!-- 性别 -->
      <el-form-item label="性别">
        <el-select v-model="localStudent.gender" class="w-full">
          <el-option label="男" value="男" />
          <el-option label="女" value="女" />
        </el-select>
      </el-form-item>

      <!-- 年龄 -->
      <el-form-item label="年龄">
        <el-input-number v-model="localStudent.age" :min="16" :max="30" />
      </el-form-item>

      <!-- 测试日期 -->
      <el-form-item label="测试日期">
        <el-date-picker v-model="localStudent.testDate" type="date" placeholder="选择日期" />
      </el-form-item>

      <!-- SCL-90因子评分 -->
      <div v-for="(value, key) in localStudent.factors" :key="key">
        <el-form-item :label="key">
          <el-slider v-model="localStudent.factors[key]" :min="1" :max="5" />
        </el-form-item>
      </div>

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
