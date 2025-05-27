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
    max: 5, // 评分范围1-5
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

      <!-- 统计指标 -->
      <div class="mt-4">
        <h3>总分: {{ scl90Store.totalScore }}</h3>
        <p class="text-gray-500">总均分: {{ scl90Store.averageScore.toFixed(2) }}</p>
        <p class="text-gray-500">阳性项目数: {{ scl90Store.positiveItems }}</p>
        <p class="text-gray-500">阳性症状均分: {{ scl90Store.positiveAverage.toFixed(2) }}</p>
      </div>

      <!-- 筛查建议 -->
      <el-card
        v-if="scl90Store.totalScore > 160
          || scl90Store.positiveItems > 43
          || Object.values(scl90Store.scores).some(score => score > 2)"
        class="mt-6"
      >
        <h4 class="font-bold">筛查建议</h4>
        <p>您的心理健康评分满足以下任一条件，建议进一步检查：</p>
        <ul class="list-disc pl-5 mt-2">
          <li>总分>160（当前总分: {{ scl90Store.totalScore }}）</li>
          <li>阳性项目数>43（当前: {{ scl90Store.positiveItems }}）</li>
          <li>任一因子分>2（当前最高因子分: {{ Math.max(...Object.values(scl90Store.scores)) }}）</li>
        </ul>
      </el-card>
    </el-card>
  </div>
</template>
