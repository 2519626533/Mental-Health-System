import { createSclRecordAPI } from '@/apis'
import { generateScl90Questions } from '@/utils/helper'
import { dayjs, ElMessage } from 'element-plus'
// store/scl90Store.ts 修复版
import { defineStore, storeToRefs } from 'pinia'
import { toRefs } from 'vue'
import { useUserStore } from './userStore'

export const useScl90Store = defineStore('scl90', {
  state: () => ({
    // 问题列表
    questions: generateScl90Questions(),

    // 答案记录（1-5分）
    answers: {} as Record<string, number>,

    // 分数结果
    scores: {
      躯体化: 0,
      强迫症状: 0,
      人际关系敏感: 0,
      抑郁: 0,
      焦虑: 0,
      敌对: 0,
      恐怖: 0,
      偏执: 0,
      精神病性: 0,
      其他: 0,
    },

    // 新增统计指标
    totalScore: 0, // 总分（修正）
    averageScore: 0, // 总均分
    positiveItems: 0, // 阳性项目数（单项分≥2）
    negativeItems: 0, // 阴性项目数（单项分=1）
    positiveAverage: 0, // 阳性症状均分
  }),

  actions: {
    // 生成初始答案（默认1分）
    initializeAnswers() {
      this.answers = this.questions.reduce((acc, q) => {
        acc[q.id] = 1 // 初始化为"从无"（评分范围1-5）
        return acc
      }, {} as Record<string, number>)
    },

    // 分组题目
    getFactorQuestions(factor: string) {
      return this.questions.filter(q => q.factor === factor)
    },

    // 计算得分（修正版）
    async calculateScores() {
      // 1. 计算总分（直接累加原始分）
      this.totalScore = Object.values(this.answers).reduce((sum, score) => sum + score, 0)

      // 2. 计算阳性项目数（单项分≥2）
      this.positiveItems = Object.values(this.answers).filter(score => score >= 2).length

      // 3. 计算阴性项目数（单项分=1）
      this.negativeItems = Object.values(this.answers).filter(score => score === 1).length

      // 4. 阳性症状均分（修正公式）
      if (this.positiveItems > 0) {
        this.positiveAverage = (this.totalScore - this.negativeItems) / this.positiveItems
      } else {
        this.positiveAverage = 0
      }

      // 5. 总均分
      this.averageScore = this.totalScore / 90

      // 6. 计算各因子分（保持原有逻辑）
      const factorScores = {
        躯体化: this.questions
          .filter(q => q.factor === '躯体化')
          .reduce((sum, q) => sum + this.answers[q.id], 0) / this.getFactorQuestions('躯体化').length,

        强迫症状: this.questions
          .filter(q => q.factor === '强迫症状')
          .reduce((sum, q) => sum + this.answers[q.id], 0) / this.getFactorQuestions('强迫症状').length,

        人际关系敏感: this.questions
          .filter(q => q.factor === '人际关系敏感')
          .reduce((sum, q) => sum + this.answers[q.id], 0) / this.getFactorQuestions('人际关系敏感').length,

        抑郁: this.questions
          .filter(q => q.factor === '抑郁')
          .reduce((sum, q) => sum + this.answers[q.id], 0) / this.getFactorQuestions('抑郁').length,

        焦虑: this.questions
          .filter(q => q.factor === '焦虑')
          .reduce((sum, q) => sum + this.answers[q.id], 0) / this.getFactorQuestions('焦虑').length,

        敌对: this.questions
          .filter(q => q.factor === '敌对')
          .reduce((sum, q) => sum + this.answers[q.id], 0) / this.getFactorQuestions('敌对').length,

        恐怖: this.questions
          .filter(q => q.factor === '恐怖')
          .reduce((sum, q) => sum + this.answers[q.id], 0) / this.getFactorQuestions('恐怖').length,

        偏执: this.questions
          .filter(q => q.factor === '偏执')
          .reduce((sum, q) => sum + this.answers[q.id], 0) / this.getFactorQuestions('偏执').length,

        精神病性: this.questions
          .filter(q => q.factor === '精神病性')
          .reduce((sum, q) => sum + this.answers[q.id], 0) / this.getFactorQuestions('精神病性').length,

        其他: this.questions
          .filter(q => q.factor === '其他')
          .reduce((sum, q) => sum + this.answers[q.id], 0) / this.getFactorQuestions('其他').length,
      }

      // 7. 更新得分
      this.scores = factorScores
      const userStore = useUserStore()

      const { userInfo } = storeToRefs(userStore)

      const dataToUpload = {
        student_id: userInfo.value.studentId,
        name: userInfo.value.name,
        gender: 0,
        age: 18,
        test_date: dayjs().format('YYYY-MM-DD'),
        somatization: this.scores.躯体化,
        obsession: this.scores.强迫症状,
        interpersonal: this.scores.人际关系敏感,
        depression: this.scores.抑郁,
        anxiety: this.scores.焦虑,
        hostility: this.scores.敌对,
        phobia: this.scores.恐怖,
        paranoia: this.scores.偏执,
        psychoticism: this.scores.精神病性,
        other: this.scores.其他,
        // totalScore: this.totalScore,
        // averageScore: this.averageScore,
        // positiveItems: this.positiveItems,
        // negativeItems: this.negativeItems,
        // positiveAverage: this.positiveAverage,
      }

      try {
        // 8. 调用后端API
        const res = await createSclRecordAPI(dataToUpload)

        if (res.data.code === 1) {
          ElMessage.success('测评结果已保存')
        } else {
          ElMessage.error(res.data.msg || '保存失败')
        }
      } catch (error: any) {
        ElMessage.error('保存失败，请检查网络连接')
        console.error('上传SCL记录失败:', error)
      }
    },

    // 重置测评
    resetTest() {
      this.answers = {}
      this.scores = {
        躯体化: 0,
        强迫症状: 0,
        人际关系敏感: 0,
        抑郁: 0,
        焦虑: 0,
        敌对: 0,
        恐怖: 0,
        偏执: 0,
        精神病性: 0,
        其他: 0,
      }
      this.totalScore = 0
      this.averageScore = 0
      this.positiveItems = 0
      this.negativeItems = 0
      this.positiveAverage = 0
    },
  },
})
