<script setup lang="ts">
</script>

<template>
  <div class="w-100% h-screen bg-#F9F9F9 relative">
    <div
      class="header w-full h-8% bg-white shadow-sm
      flex justify-center items-center"
    >
      <div class="home-link w-50% flex justify-between">
        <router-link to="/admin/">首页</router-link>
        <router-link to="/admin/data">数据</router-link>
        <router-link to="/admin/user">个人中心</router-link>
      </div>
    </div>
    <div class="main">
      <router-view />
    </div>
    <div class="footer"></div>
  </div>
</template>

<style scoped>

</style>
