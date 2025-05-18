<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps<{
  data: Record<string, number>
  loading: boolean
}>()

const chartDom = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null

// 安全获取数据
const safeGetData = () => {
  if (!props.data || typeof props.data !== 'object') {
    return { keys: [], values: [] }
  }

  const keys = Object.keys(props.data)
  const values = keys.map(key => props.data[key])
  return { keys, values }
}

// 初始化/更新图表
const initChart = () => {
  if (!chartDom.value || props.loading)
    return

  // 清除现有实例
  if (chartInstance) {
    chartInstance.dispose()
  }

  const { keys, values } = safeGetData()

  // 创建新实例
  chartInstance = echarts.init(chartDom.value)

  // 配置选项
  const option = {
    title: {
      text: '年龄分布',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    xAxis: {
      type: 'category',
      data: keys,
      axisLabel: {
        rotate: 45,
      },
    },
    yAxis: {
      type: 'value',
      min: 0,
      boundaryGap: [0, '100%'],
    },
    series: [{
      name: '人数',
      type: 'bar',
      barWidth: 20,
      itemStyle: { color: '#86F6BB' },
      data: values,
      label: {
        show: true,
        position: 'top',
      },
    }],
    grid: {
      left: 60,
      right: 30,
      bottom: 50,
      top: 40,
    },
  }

  chartInstance.setOption(option)
}

// 响应式处理
onMounted(() => {
  // 添加resize监听
  window.addEventListener('resize', initChart)

  // 初始渲染
  initChart()
})

onUnmounted(() => {
  window.removeEventListener('resize', initChart)
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
})

// 深度监听数据变化
watch(
  () => props.data,
  () => {
    // 使用nextTick确保DOM更新后再初始化
    setTimeout(() => {
      initChart()
    }, 0)
  },
  { deep: true, immediate: true },
)

// 监听loading状态变化
watch(
  () => props.loading,
  (isLoading) => {
    if (!isLoading) {
      setTimeout(() => {
        initChart()
      }, 0)
    }
  },
)
</script>

<template>
  <el-card class="chart-card shadow-md border-0 rounded-2xl h-full">
    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <el-skeleton :rows="3" animated />
    </div>

    <!-- 错误状态 -->
    <div
      v-else-if="!data || Object.keys(data).length === 0"
      class="flex justify-center items-center h-64"
    >
      <el-empty description="暂无数据" />
    </div>

    <!-- 图表容器 -->
    <div v-else ref="chartDom" class="w-full h-64"></div>
  </el-card>
</template>
