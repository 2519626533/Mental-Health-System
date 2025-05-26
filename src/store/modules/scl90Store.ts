import { generateScl90Questions } from '@/utils/helper'
// store/scl90Store.ts
import { defineStore } from 'pinia'

export const useScl90Store = defineStore('scl90', {
  state: () => ({
    // 问题列表
    questions: generateScl90Questions(),

    // 答案记录
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

    // 总分
    totalScore: 0,

    // 总均分
    averageScore: 0,
  }),

  actions: {
    // 生成初始答案
    initializeAnswers() {
      this.answers = this.questions.reduce((acc, q) => {
        acc[q.id] = 0
        return acc
      }, {} as Record<string, number>)
    },

    // 分组题目
    getFactorQuestions(factor: string) {
      return this.questions.filter(q => q.factor === factor)
    },

    // 计算得分
    calculateScores() {
      // 各因子分计算
      const factorScores = {
        躯体化: this.questions
          .filter(q => ['躯体化'].includes(q.factor))
          .reduce((sum, q) => sum + this.answers[q.id], 0) / this.getFactorQuestions('躯体化').length,

        强迫症状: this.questions
          .filter(q => q.factor === '强迫症状')
          .reduce((sum, q) => sum + this.answers[q.id], 0) / this.getFactorQuestions('强迫症状').length,

        // ...其他因子计算...
      }

      // 计算总分
      this.totalScore = Object.values(factorScores).reduce((a, b) => a + b, 0)
      this.averageScore = this.totalScore / 90

      // 更新得分
      this.scores = factorScores
    },
  },
})
