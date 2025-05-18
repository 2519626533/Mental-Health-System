<script setup lang="ts">
import AgeDistribution from '@/components/admin/AgeDistribution.vue'
import GenderChart from '@/components/admin/GenderChart.vue'
import Scl90RadarChart from '@/components/admin/Scl90RadarChart.vue'
import StudentOverview from '@/components/admin/StudentOverview.vue'
import TestTrendChart from '@/components/admin/TestTrendChart.vue'
import { useAdminStore } from '@/store/modules/adminStore'
import { computed, onMounted, ref } from 'vue'

const adminStore = useAdminStore()
const loading = ref(true)

onMounted(async () => {
  loading.value = false
})
</script>

<template>
  <div class="admin-home p-6 bg-#F9F9F9 min-h-screen">
    <!-- 顶部统计卡片 -->
    <el-row :gutter="20" class="mb-6">
      <el-col v-for="card in adminStore.statsCards" :key="card.title" :span="6">
        <StudentOverview
          :title="card.title"
          :value="card.value"
          :icon="card.icon"
          :loading="loading"
        />
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20">
      <el-col :span="8">
        <GenderChart :data="adminStore.genderData" :loading="loading" />
      </el-col>

      <el-col :span="8">
        <AgeDistribution :data="adminStore.ageData" :loading="loading" />
      </el-col>

      <el-col :span="8">
        <Scl90RadarChart :data="adminStore.scl90Factors" :loading="loading" />
      </el-col>
    </el-row>

    <el-row :gutter="20" class="mt-6">
      <el-col :span="24">
        <TestTrendChart :data="adminStore.testTrends" :loading="loading" />
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.admin-home {
  background-color: #f9f9f9;
}
</style>
