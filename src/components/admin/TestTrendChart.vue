<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps<{
  data: Array<{
    date: string
    averageScore: number
  }>
  loading: boolean
}>()

const chartDom = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null

// 初始化图表
const initChart = () => {
  if (!chartDom.value || props.loading || !props.data?.length) {
    return
  }

  // 销毁现有实例
  if (chartInstance) {
    chartInstance.dispose()
  }

  // 创建新实例
  chartInstance = echarts.init(chartDom.value)

  // 提取数据
  const dates = props.data.map(item => item.date)
  const scores = props.data.map(item => item.averageScore)

  // 配置项
  chartInstance.setOption({
    title: {
      text: '测试趋势分析',
      left: 'center',
      textStyle: {
        fontSize: 14,
        color: '#666',
      },
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        return `${params[0].axisValue}<br/>`
          + `${params[0].marker} 平均分数: ${params[0].value}分`
      },
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
      splitLine: {
        lineStyle: {
          type: 'dashed',
        },
      },
    },
    series: [{
      name: '平均分数',
      data: scores,
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      itemStyle: {
        color: '#86F6BB',
      },
      lineStyle: {
        width: 3,
      },
      areaStyle: {
        color: 'rgba(134, 246, 187, 0.2)',
      },
    }],
    grid: {
      left: 60,
      right: 30,
      bottom: 50,
      top: 40,
    },
    dataZoom: [{
      type: 'slider',
      start: 0,
      end: 100,
    }],
  })
}

// 响应式处理
onMounted(() => {
  // 添加防抖resize监听
  const resizeHandler = () => {
    if (chartInstance) {
      requestAnimationFrame(() => {
        chartInstance?.resize()
      })
    }
  }

  window.addEventListener('resize', resizeHandler)

  // 首次尝试初始化
  requestAnimationFrame(() => {
    initChart()
  })

  onUnmounted(() => {
    window.removeEventListener('resize', resizeHandler)
    if (chartInstance) {
      chartInstance.dispose()
      chartInstance = null
    }
  })
})

// 监听数据变化
watch(() => props.data, (newData) => {
  if (newData?.length > 0 && !props.loading) {
    requestAnimationFrame(() => {
      initChart()
    })
  }
}, { deep: true, immediate: true })

// 监听加载状态
watch(() => props.loading, (isLoading) => {
  if (!isLoading && props.data?.length > 0) {
    requestAnimationFrame(() => {
      initChart()
    })
  }
})
</script>

<template>
  <el-card class="chart-card shadow-md border-0 rounded-2xl h-full">
    <!-- 加载状态 -->
    <div v-if="props.loading" class="flex justify-center items-center h-64">
      <el-skeleton :rows="3" animated />
    </div>

    <!-- 错误状态 -->
    <div
      v-else-if="!props.data || props.data.length === 0"
      class="flex justify-center items-center h-64"
    >
      <el-empty description="暂无趋势数据" />
    </div>

    <!-- 图表容器 -->
    <div v-else ref="chartDom" class="w-full h-64"></div>
  </el-card>
</template>
