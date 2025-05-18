<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps<{
  data: Array<{ gender: string, count: number }>
  loading: boolean
}>()

const chartDom = ref<HTMLDivElement | null>(null) // 显式声明类型
let chartInstance: echarts.ECharts | null = null // 图表实例缓存

// 初始化图表逻辑
const initChart = () => {
  if (!chartDom.value || props.loading || !props.data?.length) {
    return
  }

  // 清除现有实例
  if (chartInstance) {
    chartInstance.dispose()
  }

  // 创建新实例
  chartInstance = echarts.init(chartDom.value)

  // 计算总数
  const total = props.data.reduce((sum, item) => sum + item.count, 0)

  // 配置项保持不变...
  chartInstance.setOption({
    // ...原有配置
    title: {
      text: `性别分布\n\n总数：${total}`,
      left: 'center',
      textStyle: {
        fontSize: 14,
        color: '#666',
      },
    },
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        return `${params.seriesName}<br />`
          + `${params.marker} ${params.name}: ${params.value}人 `
          + `(${params.percent}%)`
      },
    },
    series: [{
      type: 'pie',
      radius: ['30%', '60%'],
      data: props.data.map(item => ({
        value: item.count,
        name: item.gender,
      })),
      itemStyle: {
        borderRadius: 8,
        borderColor: '#fff',
        borderWidth: 2,
      },
      label: {
        show: true,
        position: 'outside',
        formatter: '{b}: {c}人 ({d}%)',
        color: '#333',
      },
      labelLine: {
        lineStyle: {
          color: '#999',
        },
      },
    }],
    color: ['#86F6BB', '#2FD2FE'],
    legend: {
      show: true,
      orient: 'vertical',
      right: 10,
      top: 30,
      bottom: 20,
      itemStyle: {
        borderRadius: 4,
      },
    },

  })
}

// 生命周期管理
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
  initChart()
})

onUnmounted(() => {
  window.removeEventListener('resize', initChart)
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
})

// 响应数据变化
watch(() => props.data, (newData) => {
  if (newData?.length > 0 && !props.loading) {
    // 延迟执行确保DOM更新
    requestAnimationFrame(() => {
      initChart()
    })
  }
}, { deep: true, immediate: true })

// 监听loading状态变化
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
      <el-empty description="暂无数据" />
    </div>

    <!-- 图表容器 -->
    <div v-else ref="chartDom" class="w-full h-64"></div>
  </el-card>
</template>
