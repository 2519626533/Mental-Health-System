<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps<{
  data: Record<string, number>
  loading: boolean
}>()

const chartDom = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null

// 验证数据有效性
const hasValidData = () => {
  return props.data
    && Object.keys(props.data).length > 0
    && Object.values(props.data).some(v => v > 0)
}

// 安全初始化图表
const initChart = () => {
  if (!chartDom.value || props.loading || !hasValidData())
    return

  // 销毁旧实例
  if (chartInstance) {
    chartInstance.dispose()
  }

  // 创建新实例
  chartInstance = echarts.init(chartDom.value)

  // 数据转换
  const factors = Object.keys(props.data)
  const scores = Object.values(props.data)

  // 图表配置
  chartInstance.setOption({
    title: {
      text: 'SCL-90 因子分布',
      left: 'center',
      textStyle: {
        fontSize: 14,
        color: '#666',
      },
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        return `${params[0].name}<br/>${
          params.map((item: any) =>
            `${item.marker} ${item.axisValue}: ${item.value}`,
          ).join('<br/>')}`
      },
    },
    radar: {
      indicator: factors.map(factor => ({
        name: factor,
        max: 5,
      })),
      radius: 80,
      axisName: {
        color: '#333',
      },
      splitLine: {
        lineStyle: {
          color: '#e0e0e0',
        },
      },
      splitArea: {
        show: true,
        areaStyle: {
          color: 'rgba(134, 246, 187, 0.05)',
        },
      },
    },
    series: [{
      type: 'radar',
      data: [{
        value: scores,
        name: '心理因子评分',
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          width: 2,
        },
        emphasis: {
          areaStyle: {
            color: 'rgba(134, 246, 187, 0.3)',
          },
        },
      }],
      itemStyle: {
        color: '#86F6BB',
      },
    }],
    color: ['#86F6BB'],
  })
}

// 响应式处理
onMounted(() => {
  // 添加防抖优化性能
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
})

onUnmounted(() => {
  window.removeEventListener('resize', initChart)
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
})

// 监听数据变化
watch(() => props.data, () => {
  if (hasValidData() && !props.loading) {
    requestAnimationFrame(() => {
      initChart()
    })
  }
}, { deep: true, immediate: true })

// 监听加载状态变化
watch(() => props.loading, (isLoading) => {
  if (!isLoading && hasValidData()) {
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
    <div v-else-if="!props.data || !hasValidData()" class="flex justify-center items-center h-64">
      <el-empty description="暂无有效数据" />
    </div>

    <!-- 图表容器 -->
    <div v-else ref="chartDom" class="w-full h-64"></div>
  </el-card>
</template>
