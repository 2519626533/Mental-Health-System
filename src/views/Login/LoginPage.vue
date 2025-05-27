<script setup lang="ts">
import type { IUserInfo } from '@/types/user'
import { userLoginAPI, userRegisterAPI } from '@/apis'
import EcgBackground from '@/components/EcgBackground.vue'
import { useUserStore } from '@/store'
import { decrypt, encrypt } from '@/utils/helper'
import { Lock, User } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

// 页面状态
const isLogin = ref(true)

const userInfo = ref<IUserInfo>({
  account: '',
  password: '',
  role_id: '2',
})
// 记住我
const rememberMe = ref<boolean>(false)
// 锁定登录框
const isLocked = ref<boolean>(true)
// 获取Store
const userStore = useUserStore()

const router = useRouter()
// 登录事件
const handleLogIn = async () => {
  const res = await userLoginAPI(userInfo.value)
  const loginSuc = res.data.code === 1

  if (loginSuc) {
    // 1. 更新store
    const role = res.data.data.role === '1' ? 'admin' : 'student'
    userStore.updateInfo({
      ...res.data.data,
      role, // 确保role字段为'admin'/'student'
    })

    // 2. 跳转逻辑
    const redirect = role === 'admin' ? '/admin' : '/student'
    router.push(redirect)

    // 3. 保存token
    userStore.updateToken(res.data.data.authentication)
  } else {
    ElMessage({
      type: 'error',
      message: res.data.msg,
    })
  }
}

// 注册事件
const handleRegister = async () => {
  const res = await userRegisterAPI(userInfo.value)
  if (res.data) {
    isLogin.value = !isLogin.value
  }
}
onMounted(() => {
  const cookies = document.cookie.split(';').reduce((acc, item) => {
    const [key, value] = item.trim().split('=')
    acc[key] = value
    return acc
  }, {} as Record<string, string>)
  if (cookies.rememberMe === 'true') {
    userInfo.value.account = decrypt(cookies.account, 'USER_ACCOUNT')
    userInfo.value.password = decrypt(cookies.password, 'USER_PASSWORD')
    rememberMe.value = true
  }
})
</script>

<template>
  <div class="w-screen h-screen bg-theme-bg-color relative">
    <!-- 心电图bg -->
    <EcgBackground />
    <!-- 登录框容器 -->
    <div
      class="login-container animate-breathe centered-absolute flex justify-center items-center
      w-6/10 h-2/3 bg-#fff rounded-3xl shadow-xl
      hover:animate-none hover:opacity-100!"
      :class="{
        paused: isLocked,
      }"
    >
      <!-- 锁定按钮 -->
      <div
        class="locking absolute top--20 px-48% h-15 w-full
      transition-transform duration-800 ease-in-out opacity-0"
        :class="{
          'locked-hover': isLocked,
        }"
      >
        <el-button
          class="shadow-lg hover:bg-theme-color! hover:color-black!"
          :class="{
            'locked-hover-button': isLocked,
          }"
          size="large"
          :icon="Lock"
          circle
          @click="isLocked = !isLocked"
        ></el-button>
      </div>
      <Transition name="slide" mode="out-in">
        <!-- 登陆表单 -->
        <div
          v-if="isLogin"
          key="login"
          class="container-left login w-2/4 h-full flex flex-col justify-start items-center"
        >
          <div class="title h-1/4 w-1/2 pt-10 text-center">
            <h1 class="font-bold text-3xl">Hello!</h1>
            <span class="text-4 text-justify">登 陆 您 的 账 号</span>
          </div>
          <div class="form h-2/3 w-full flex justify-start items-center flex-col">
            <!-- 账号 -->
            <el-input
              v-model="userInfo.account"
              class="account w-2/3 h-12 mt-5 rounded-15px text-15px shadow-md focus:"
              placeholder="请输入您的账号"
              :prefix-icon="User"
              style="width: 80%;"
            ></el-input>
            <!-- 密码 -->
            <el-input
              v-model="userInfo.password"
              style="width: 80%;"
              class="password w-2/3 h-12 mt-8 rounded-15px text-15px shadow-md"
              placeholder="请输入您的密码"
              :prefix-icon="Lock"
              type="password"
              @keyup.enter="handleLogIn"
            ></el-input>
            <div class="features w-2/3 mt-2 flex justify-start">
              <el-checkbox v-model="rememberMe" class="remember">记住账号</el-checkbox>
            </div>
            <!-- 登录按钮 -->
            <div class="button w-1/3 h-15 my-6">
              <el-button
                class="w-full"
                color="#86F6BB"
                size="large"
                type="primary"
                round
                @click="handleLogIn"
              >
                登录
              </el-button>
            </div>
            <span
              class="text-sm opacity-40 cursor-pointer select-none"
              contenteditable="false"
              @click="isLogin = !isLogin"
            >注册账号→</span>
          </div>
        </div>
        <!-- 注册表单 -->
        <div
          v-else
          key="register"
          class="container-left register w-2/4 h-full flex flex-col justify-start items-center"
        >
          <div class="title h-1/4 w-1/2 pt-10 text-center">
            <h1 class="font-bold text-3xl">Hello!</h1>
            <span class="text-4 text-justify">注 册 您 的 账 号</span>
          </div>
          <div class="form h-2/3 w-full flex justify-start items-center flex-col">
            <!-- 账号 -->
            <el-input
              v-model="userInfo.account"
              style="width: 80%;"
              class="account w-2/3 h-12 mt-5 rounded-15px text-15px shadow-md focus:"
              placeholder="请输入您的账号"
              :prefix-icon="User"
            ></el-input>
            <!-- 密码 -->
            <el-input
              v-model="userInfo.password"
              style="width: 80%;"
              class="password w-2/3 h-12 mt-8 rounded-15px text-15px shadow-md"
              placeholder="请输入您的密码"
              :prefix-icon="Lock"
              type="password"
              @keyup.enter="handleRegister"
            ></el-input>
            <el-radio-group v-model="userInfo.role_id" class="mt-2">
              <el-radio value="1">管理员</el-radio>
              <el-radio value="2">用户</el-radio>
            </el-radio-group>
            <!-- 注册按钮 -->
            <div class="button w-1/3 h-15 mt-14 mb-9">
              <el-button
                class="w-full"
                color="#2FD2FE"
                size="large"
                type="primary"
                round
                @click="handleRegister"
              >
                注册
              </el-button>
            </div>
            <span
              class="text-sm opacity-40 cursor-pointer select-none"
              contenteditable="false"
              @click="isLogin = !isLogin"
            >←登录账号</span>
          </div>
        </div>
      </Transition>
      <!-- 登录页介绍 -->
      <div class="container-right w-2/4 overflow-hidden">
        <div class="content flex flex-col justify-start items-center h-80">
          <h1 class="intro text-3xl font-bold py-6">欢迎回来！</h1>
          <div class="scrolling-text-container relative w-2/3">
            <div class="scrolling-text animate-text-scroll h-48">
              我们提供专业的心理评估工具与个性化干预方案，
              帮助用户实时追踪情绪状态、管理压力水平，
              并通过认知行为疗法（CBT）模块改善负面思维模式。
              系统支持匿名咨询、冥想指导及危机干预功能，
              为您的心理健康保驾护航。
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.el-input {
  --el-border-radius-base: 15px;
  --el-input-focus-border-color: #86f6bb;
}
/* 背景图呼吸效果 */
@keyframes breathe {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
.animate-breathe {
  animation: breathe 6s infinite;
  opacity: 1;
}
.paused {
  opacity: 1 !important;
  animation-play-state: paused !important;
}
/* 文字滚动效果 */
@keyframes textScroll {
  0% {
    transform: translateY(100%);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(0%);
    opacity: 0;
  }
}
.container-right {
  height: 300px; /* 根据实际高度设置 */
}
.animate-text-scroll {
  animation: textScroll 15s linear infinite;
}
.login-container:hover .locking {
  transform: translateY(20px);
  opacity: 1;
}
.locked-hover {
  opacity: 1;
  transform: translateY(20px);
}
.locked-hover-button {
  background-color: #86f6bb;
}
/* 表单切换动画效果 */
.container-left {
  min-height: 400px; /* 根据实际高度设置固定值 */
}
.slide-enter-active .slide-leave-active {
  transition: all 1s linear;
  position: absolute;
  width: 50%;
}
.slide-enter-from {
  transform: translateX(-15px);
}
.slide-leave-to {
  transform: translateX(15px);
}
</style>
