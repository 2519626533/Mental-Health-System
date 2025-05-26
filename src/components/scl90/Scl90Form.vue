<script setup lang="ts">
import { useScl90Store } from '@/store/modules/scl90Store'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const scl90Store = useScl90Store()
const router = useRouter()

// 每页显示10题
const itemsPerPage = 10
// 当前页码（从0开始）
const currentPage = ref(0)
// 总页数
const totalPages = computed(() => Math.ceil(scl90Store.questions.length / itemsPerPage))

// 当前页问题
const currentQuestions = computed(() => {
  const start = currentPage.value * itemsPerPage
  return scl90Store.questions.slice(start, start + itemsPerPage)
})

// 进度百分比
const progressPercent = computed(() => {
  const answered = Object.values(scl90Store.answers).filter(score => score > 0).length
  return Math.round((answered / 90) * 100)
})

// 保存草稿
const saveDraft = () => {
  localStorage.setItem('scl90_draft', JSON.stringify(scl90Store.answers))
}

// 提交回答
const submitAnswers = () => {
  // 保存当前页答案
  saveDraft()

  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++
  } else {
    // 计算得分
    scl90Store.calculateScores()
    router.push({ query: { step: 'result' } })
  }
}

// 返回上一步
const prevStep = () => {
  if (currentPage.value > 0) {
    currentPage.value--
  }
}
</script>

<template>
  <el-card class="question-form shadow-md border-0 rounded-2xl mb-6">
    <!-- 进度条 -->
    <el-progress
      :percentage="progressPercent"
      :color="['#86F6BB']"
      :text-inside="true"
      class="mb-4"
    />

    <h3 class="text-lg font-bold mb-4">请根据最近一周情况作答</h3>

    <!-- 问题列表 -->
    <el-row :gutter="20" class="question-list">
      <el-col v-for="question in currentQuestions" :key="question.id" :span="24">
        <div class="flex justify-between items-center py-3">
          <span>{{ question.id }}. {{ question.text }}</span>
          <el-rate
            v-model="scl90Store.answers[question.id]"
            :max="4"
            :colors="['#ff4444', '#f7ba2a', '#2FD2FE', '#86F6BB', '#2FD2FE']"
            void-color="#bbb"
          >
          </el-rate>
        </div>
      </el-col>
    </el-row>

    <!-- 导航 -->
    <div class="flex justify-between mt-6">
      <el-button :disabled="currentPage === 0" @click="prevStep">
        上一步
      </el-button>
      <el-button color="#86F6BB" @click="submitAnswers">
        {{ currentPage < totalPages - 1 ? '下一步' : '提交' }}
      </el-button>
    </div>
  </el-card>
</template>
