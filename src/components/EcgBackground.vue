<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps<{
  lineColor?: string
  speed?: number
}>()
const createEcgAnimation = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return
  }
  let w = 0
  let h = 0
  const lineData: { x: number, y: number }[] = []
  const maxHeight = 50
  let active = 0
  const heartData: { x: number, y: number }[] = []
  const heartR = 7
  let dt = 0
  let x = 0
  let y = 0
  let startX = 0
  let startY = 0
  const lineColor = props.lineColor || '#86F6BB'
  const speed = props.speed || 5
  const shadowColor = 'rgba(255,255,255,.5)'
  let centerY = 0
  let animationFrame = 0

  const getHeart = () => {
    let t = Math.PI + 0.5
    const maxT = 2 * Math.PI - 1
    const vt = speed / 100
    let x = 0
    let y = 0
    const r = heartR
    for (let i = 0; i < Math.ceil(maxT / vt); i++) {
      x = 16 * Math.sin(t) ** 3
      y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)
      t += vt
      x *= r
      y = -y * r - r * Math.PI * 4
      if (y < 0) {
        heartData.push({ x, y })
      }
    }
  }
  const clear = () => {
    heartData.length = lineData.length = 0
    active = 0
    x = 0
    getHeart()
    ctx.clearRect(0, 0, w, h)
  }
  // 重置
  const reset = () => {
    w = canvas.width = window.innerWidth
    h = canvas.height = window.innerHeight
    centerY = h / 2 + heartR * Math.PI * 2
    y = centerY
    clear()
  }
  const drawTopLine = () => {
    lineData.unshift({ x, y })
    let x1 = x + Math.random() * speed + speed
    let y1 = centerY

    if (x1 > w * 0.05 && x1 < w * 0.95) {
      if (Math.random() > 0.8 && active === 0) {
        y1 += Math.random() * maxHeight * 2 - maxHeight
      }
      if (x1 > w * 0.25 && active === 0)
        active = 1
      if (x1 > w * 0.38 && active === 1) {
        active = 2
        startX = x1 + speed * 3
        startY = centerY
      }
      if (heartData.length > 0 && active === 2) {
        const __pos = heartData.shift()!
        x1 = startX + __pos.x
        y1 = startY + __pos.y
        if (y1 > startY)
          y1 = startY
      }
      if (x1 > 0.55 * w && heartData.length === 0 && active === 2) {
        active = 0
      }
    }

    ctx.lineWidth = 3
    ctx.strokeStyle = 'rgba(255,255,255,.5)'
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'
    ctx.shadowBlur = 20
    ctx.shadowColor = shadowColor
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x1, y1)
    ctx.stroke()
    ctx.closePath()

    x = x1
    y = y1
  }

  const drawLine = () => {
    if (lineData.length < 2) {
      return
    }
    ctx.lineWidth = 3
    ctx.strokeStyle = lineColor
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'
    ctx.shadowBlur = 20
    ctx.shadowColor = shadowColor
    ctx.beginPath()
    ctx.moveTo(lineData[1].x, lineData[1].y)
    ctx.lineTo(lineData[0].x, lineData[0].y)
    ctx.stroke()
    ctx.closePath()
  }

  const step = () => {
    animationFrame = requestAnimationFrame(step)
    if (dt % 1 === 0) {
      drawLine()
      drawTopLine()
    }
    if (x > w + speed) {
      clear()
    }
    dt++
  }
  // 初始化
  const init = () => {
    reset()
    window.addEventListener('resize', reset)
    step()
  }

  init()
  return () => {
    cancelAnimationFrame(animationFrame)
    window.removeEventListener('resize', reset)
  }
}

const canvasRef = ref<HTMLCanvasElement>()
let destroyAnimation: (() => void) | undefined

onMounted(() => {
  if (canvasRef.value) {
    destroyAnimation = createEcgAnimation(canvasRef.value)
  }
})
onBeforeUnmount(() => {
  if (destroyAnimation) {
    destroyAnimation()
    destroyAnimation = undefined
  }
})
</script>

<template>
  <div class="ecg-background absolute inset-0">
    <canvas ref="canvasRef" class="w-full h-full"></canvas>
  </div>
</template>

<style scoped>

</style>
