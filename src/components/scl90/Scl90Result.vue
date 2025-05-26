<script setup lang="ts">
import { useScl90Store } from '@/store/modules/scl90Store'
import * as echarts from 'echarts'
import { onMounted, onUnmounted, ref, watch } from 'vue'

const scl90Store = useScl90Store()
const chartDom = ref<HTMLElement | null>(null)

// 初始化图表
const initChart = () => {
  if (!chartDom.value)
    return

  const chart = echarts.init(chartDom.value)

  // 雷达图配置
  const factors = Object.keys(scl90Store.scores)
  const factorNames = factors.map(factor => ({
    name: factor,
    max: 4,
  }))

  chart.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    radar: {
      indicator: factorNames,
      radius: 120,
    },
    series: [{
      name: '心理健康评分',
      type: 'radar',
      data: [{
        value: factors.map(factor => scl90Store.scores[factor]),
        name: '心理健康评分',
      }],
      itemStyle: {
        color: '#86F6BB',
      },
      areaStyle: {
        opacity: 0.2,
      },
    }],
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

// 监听得分变化
watch(() => scl90Store.scores, initChart)
</script>

<template>
  <div class="scl90-result p-6">
    <el-card class="result-card shadow-md border-0 rounded-2xl mb-6">
      <h2 class="text-xl font-bold p-4">测评结果</h2>

      <!-- 雷达图 -->
      <div ref="chartDom" class="w-full h-64"></div>

      <!-- 详细评分 -->
      <el-table :data="[scl90Store.scores]" border class="mt-6">
        <el-table-column
          v-for="(value, factor) in scl90Store.scores"
          :key="factor"
          :label="factor"
          :prop="factor"
          :formatter="() => value.toFixed(2)"
        />
      </el-table>

      <!-- 总分 -->
      <div class="mt-4">
        <h3>总分: {{ scl90Store.totalScore }}</h3>
        <p class="text-gray-500">总均分: {{ scl90Store.averageScore.toFixed(2) }}</p>
      </div>

      <!-- 建议 -->
      <el-card v-if="scl90Store.averageScore > 2" class="mt-6">
        <h4 class="font-bold">建议</h4>
        <p>您的心理健康评分表明存在一定的心理困扰，建议您：</p>
        <ul class="list-disc pl-5 mt-2">
          <li>预约专业心理咨询</li>
          <li>定期进行心理测评</li>
          <li>关注情绪变化</li>
          <li>保持规律作息</li>
        </ul>
      </el-card>
    </el-card>
  </div>
</template>
