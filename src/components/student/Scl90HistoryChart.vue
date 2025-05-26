<script setup lang="ts">
import { useUserStore } from '@/store/modules/userStore'
import * as echarts from 'echarts'
import { onMounted, onUnmounted, ref, watch } from 'vue'

const userStore = useUserStore()
const chartDom = ref<HTMLElement | null>(null)

// 初始化图表
const initChart = () => {
  if (!chartDom.value)
    return

  const chart = echarts.init(chartDom.value)

  // 示例数据
  const factors = Object.keys(userStore.userInfo.scl90 || {})
  const dates = userStore.userInfo.testHistory?.map((_, i) => `测试${i + 1}`) || []
  const scores = factors.map(factor =>
    userStore.userInfo.testHistory?.map(history =>
      history.scl90?.[factor] || 0,
    ) || [],
  )

  // 配置项
  chart.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {
      data: factors,
      top: 10,
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisLabel: {
        rotate: 45,
      },
    },
    yAxis: {
      type: 'value',
      min: 1,
      max: 5,
    },
    series: factors.map((factor, i) => ({
      name: factor,
      type: 'line',
      data: scores[i],
      smooth: true,
      itemStyle: {
        color: ['#86F6BB', '#2FD2FE'][i % 2],
      },
    })),
    grid: {
      left: 60,
      right: 30,
      bottom: 50,
      top: 60,
    },
  })
}

// 生命周期处理
onMounted(() => {
  window.addEventListener('resize', initChart)
  initChart()
})

onUnmounted(() => {
  window.removeEventListener('resize', initChart)
})
</script>

<template>
  <el-card class="history-chart shadow-md border-0 rounded-2xl h-64">
    <h3 class="text-lg font-bold p-4">SCL-90 历史测评</h3>
    <div ref="chartDom" class="w-full h-64"></div>
  </el-card>
</template>
