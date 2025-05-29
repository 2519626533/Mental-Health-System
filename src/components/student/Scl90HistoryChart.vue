<script setup lang="ts">
import { fetchCurrentUserSclAPI } from '@/apis'
import { useUserStore } from '@/store/modules/userStore'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'
import { onMounted, onUnmounted, ref } from 'vue'

const userStore = useUserStore()
const chartDom = ref<HTMLElement | null>(null)
const chartInstance = ref<echarts.ECharts | null>(null)

// 因子映射表（与后端字段对应）
const factorMap = {
  somatization: '躯体化',
  obsession: '强迫症状',
  interpersonal: '人际关系敏感',
  depression: '抑郁',
  anxiety: '焦虑',
  hostility: '敌对',
  phobia: '恐怖',
  paranoia: '偏执',
  psychoticism: '精神病性',
  other: '其他',
}

// 初始化图表
const initChart = (factors: string[], dates: string[], scores: number[][]) => {
  if (!chartDom.value)
    return

  // 销毁已有实例
  if (chartInstance.value) {
    chartInstance.value.dispose()
  }

  // 创建新实例
  chartInstance.value = echarts.init(chartDom.value)

  // 验证数据
  const validFactors = factors.filter(f => factorMap[f])
  const validDates = dates.length > 0 ? dates : ['无数据']
  const validScores = scores.map(s => s.length > 0 ? s : [0])

  // 配置项
  chartInstance.value.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
    },
    legend: {
      data: validFactors.map(f => factorMap[f]),
      top: 10,
    },
    xAxis: {
      type: 'category',
      data: validDates,
      axisLabel: { rotate: 45 },
    },
    yAxis: {
      type: 'value',
      min: 1,
      max: 5,
    },
    series: validFactors.map((factor, i) => ({
      name: factorMap[factor],
      type: 'line', // 确保类型为line
      data: validScores[i],
      smooth: true,
      itemStyle: { color: ['#86F6BB', '#2FD2FE'][i % 2] },
    })),
    grid: {
      left: 60,
      right: 30,
      bottom: 50,
      top: 60,
    },
  })
}

// 加载历史数据
const loadHistoryData = async () => {
  try {
    const res = await fetchCurrentUserSclAPI()

    if (res.data.code === 1) {
      // 解析数据
      const factors = Object.keys(factorMap)

      // 确保数据存在
      const validData = res.data.data || []

      // 获取测试日期
      const dates = validData.map((_, i) => `测试${i + 1}`)

      // 获取各因子分
      const scores = factors.map(factor =>
        validData.map((record) => {
          // 确保数据有效
          if (!record || record[factor] === undefined) {
            return 0
          }
          return Number(record[factor]) || 0
        }),
      )

      // 初始化图表
      initChart(factors, dates, scores)
    } else {
      ElMessage.error(res.data.msg || '数据加载失败')
    }
  } catch (error: any) {
    ElMessage.error('数据加载失败，请检查网络连接')
    console.error('获取历史数据失败:', error)
  }
}

// 图表自适应
const resizeChart = () => {
  if (chartInstance.value) {
    chartInstance.value.resize()
  }
}

// 生命周期处理
onMounted(() => {
  window.addEventListener('resize', resizeChart)
  loadHistoryData()
})

onUnmounted(() => {
  // 清理图表实例
  if (chartInstance.value) {
    chartInstance.value.dispose()
  }

  // 移除监听器
  window.removeEventListener('resize', resizeChart)
})
</script>

<template>
  <el-card class="history-chart shadow-md border-0 rounded-2xl h-96">
    <h3 class="text-lg font-bold p-4">SCL-90 历史测评</h3>
    <div ref="chartDom" class="w-full h-80"></div>
  </el-card>
</template>
