<script setup lang="ts">
import { useStudentStore } from '@/store/modules/studentStore'
import { onMounted, ref } from 'vue'

const studentStore = useStudentStore()
const activeIndex = ref(0)

// 自动播放逻辑
const startAutoPlay = () => {
  setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % studentStore.carouselItems.length
  }, 5000)
}

const hanldeClick = (link: string) => {
  window.open(link)
}

onMounted(() => {
  studentStore.fetchMockData()
  startAutoPlay()
})
</script>

<template>
  <el-carousel v-model="activeIndex" :interval="5000" class="carousel-container mb-6">
    <el-carousel-item
      v-for="(item, index) in studentStore.carouselItems"
      :key="index"
      class="cursor-pointer"
      @click="() => hanldeClick(item.link)"
    >
      <div class="carousel-item flex justify-center items-center p-4">
        <img :src="item.imageUrl" :alt="item.title" class="max-h-full max-w-full bg-black">
      </div>
    </el-carousel-item>
  </el-carousel>
</template>

<style scoped>
.carousel-container :deep(.el-carousel__indicators) {
  bottom: 20px;
}

.carousel-item img {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
}
</style>
