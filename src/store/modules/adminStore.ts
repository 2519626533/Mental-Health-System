// store/adminStore.ts
import { generateMockData } from '@/utils/helper'
import { defineStore } from 'pinia'

export const useAdminStore = defineStore('admin', {
  state: () => {
    const mockData = generateMockData()

    return {
      statsCards: mockData.statsCards,
      genderData: mockData.genderData,
      ageData: mockData.ageDistribution,
      scl90Factors: mockData.scl90Factors,
      testTrends: mockData.testTrends,
      testRecords: mockData.testRecords,
      loading: false,
    }
  },

  actions: {
    async fetchStudentStats() {
      // TODO: 替换为真实API调用
      this.genderData = [
        { gender: '男', count: 120 },
        { gender: '女', count: 80 },
      ]

      this.ageData = {
        '18-20': 50,
        '21-23': 120,
        '24-26': 70,
        '27-30': 30,
      }

      this.statsCards[0].value = 200
      this.statsCards[1].value = 15
      this.statsCards[2].value = 3.2
      this.statsCards[3].value = 4.8
    },

    async fetchScl90Data() {
      // TODO: 替换为真实API调用
      this.scl90Factors = {
        躯体化: 3.2,
        强迫症状: 4.1,
        人际关系敏感: 3.8,
        抑郁: 4.0,
        焦虑: 3.5,
        敌对: 2.8,
        恐怖: 3.1,
        偏执: 2.9,
        精神病性: 2.6,
        其他: 3.3,
      }

      this.testTrends = [
        { date: '周一', averageScore: 3.2 },
        { date: '周二', averageScore: 3.5 },
        { date: '周三', averageScore: 3.7 },
        { date: '周四', averageScore: 3.4 },
        { date: '周五', averageScore: 3.6 },
      ]
    },
  },
})
