import { generateLink } from '@/utils/helper'
import { defineStore } from 'pinia'

export const useStudentStore = defineStore('student', {
  state: () => ({
    // 轮播图数据
    carouselItems: [] as Array<{ title: string, imageUrl: string, link: string }>,

    // 附加资源
    additionalResources: [] as Array<{ title: string, description: string, link: string }>,
  }),

  actions: {
    // 加载模拟数据
    fetchMockData() {
      const mockLink = generateLink()
      this.carouselItems = mockLink.carouselItems
      this.additionalResources = mockLink.additionalResources
    },
  },
})
