<script setup lang="ts">
import MentalHealthCarousel from '@/components/student/MentalHealthCarousel.vue'
import ResourceCard from '@/components/student/ResourceCard.vue'
import Scl90HistoryChart from '@/components/student/Scl90HistoryChart.vue'
import { useStudentStore } from '@/store/modules/studentStore'
import { useUserStore } from '@/store/modules/userStore'

const studentStore = useStudentStore()
const userStore = useUserStore()

// 模拟用户数据
studentStore.fetchMockData()
userStore.userInfo = {
  account: 'student123',
  password: 'password',
  name: '张三',
  email: 'zhangsan@example.com',
  role: 'student',
  isAuthenticated: true,
  testHistory: [
    {
      testId: '1',
      testDate: '2025-04-01',
      scl90: {
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
      },
    },
    {
      testId: '2',
      testDate: '2025-04-15',
      scl90: {
        躯体化: 3.0,
        强迫症状: 3.9,
        人际关系敏感: 3.5,
        抑郁: 3.7,
        焦虑: 3.2,
        敌对: 2.6,
        恐怖: 3.0,
        偏执: 2.8,
        精神病性: 2.4,
        其他: 3.1,
      },
    },
  ],
}
</script>

<template>
  <div class="student-home p-6 bg-#F9F9F9">
    <!-- 轮播图 -->
    <MentalHealthCarousel />

    <el-row :gutter="40" class="mt-6">
      <el-col :span="12">
        <!-- 测评图表 -->
        <Scl90HistoryChart />
      </el-col>

      <el-col :span="12">
        <!-- 资料卡片 -->
        <div class="space-y-4">
          <h3 class="text-lg font-bold mb-4">最新心理健康资源</h3>
          <el-row :gutter="20">
            <el-col
              v-for="(item, index) in studentStore.additionalResources"
              :key="index"
              :span="12"
            >
              <ResourceCard :title="item.title" :description="item.description" :link="item.link" />
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
