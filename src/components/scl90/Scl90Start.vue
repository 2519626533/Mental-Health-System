<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="scl90-start flex flex-col items-center justify-center min-h-[60vh]">
    <el-card class="instruction-card shadow-md border-0 rounded-2xl p-6 mb-6 max-w-md">
      <h2 class="text-xl font-bold mb-4">SCL-90 测评说明</h2>
      <p class="mb-2">本测评包含90个问题，用于评估心理健康状况的10个维度：</p>
      <ul class="list-disc pl-5 space-y-1 mb-4">
        <li>躯体化</li>
        <li>强迫症状</li>
        <li>人际关系敏感</li>
        <li>抑郁</li>
        <li>焦虑</li>
        <li>敌对</li>
        <li>恐怖</li>
        <li>偏执</li>
        <li>精神病性</li>
        <li>其他</li>
      </ul>
      <el-button
        olor="#2FD2FE"
        class="px-8 py-3 text-xl"
        @click="router.push({ query: { step: 'form' } })"
      >
        开始测评
      </el-button>
    </el-card>
  </div>
</template>
