<script setup lang="ts">
import Scl90Form from '@/components/scl90/Scl90Form.vue'
import Scl90Result from '@/components/scl90/Scl90Result.vue'
import Scl90Start from '@/components/scl90/Scl90Start.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="scl90-page p-6 bg-#F9F9F9 min-h-screen">
    <div v-if="route.query.step === 'start'">
      <Scl90Start />
    </div>
    <div v-else-if="route.query.step === 'form'">
      <Scl90Form />
    </div>
    <div v-else-if="route.query.step === 'result'">
      <Scl90Result />
    </div>
    <div v-else>
      <Scl90Start />
    </div>
  </div>
</template>
