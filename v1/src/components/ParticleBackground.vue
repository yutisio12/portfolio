<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const props = defineProps<{
  isDark: boolean
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let animationFrameId: number

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  let width = window.innerWidth
  let height = window.innerHeight
  canvas.width = width
  canvas.height = height

  const particles: Array<{ x: number; y: number; radius: number; vx: number; vy: number; alpha: number; color: string }> = []

  const themeColors = [
    props.isDark ? 'rgba(102, 217, 239, 1)' : 'rgba(62, 146, 204, 1)',
    props.isDark ? 'rgba(249, 38, 114, 1)' : 'rgba(216, 49, 91, 1)',
    props.isDark ? 'rgba(230, 219, 116, 1)' : 'rgba(30, 3, 90, 1)',
    props.isDark ? 'rgba(253, 151, 31, 1)' : 'rgba(10, 36, 99, 1)',
    props.isDark ? 'rgba(166, 226, 46, 1)' : 'rgba(216, 49, 91, 1)',
    props.isDark ? 'rgba(174, 129, 255, 1)' : 'rgba(62, 146, 204, 1)',
    props.isDark ? 'rgba(248, 248, 242, 1)' : 'rgba(255, 250, 255, 1)',
  ]

  for (let i = 0; i < 150; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      alpha: Math.random() * 0.5 + 0.1,
      color: themeColors[i % themeColors.length]
    })
  }

  const animate = () => {
    ctx.clearRect(0, 0, width, height)

    particles.forEach((p) => {
      p.x += p.vx
      p.y += p.vy

      if (p.x < 0) p.x = width
      if (p.x > width) p.x = 0
      if (p.y < 0) p.y = height
      if (p.y > height) p.y = 0

      ctx.globalAlpha = p.alpha
      ctx.fillStyle = p.color
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
      ctx.fill()
    })

    animationFrameId = requestAnimationFrame(animate)
  }

  animate()

  const handleResize = () => {
    width = window.innerWidth
    height = window.innerHeight
    canvas.width = width
    canvas.height = height
  }

  window.addEventListener('resize', handleResize)

  onUnmounted(() => {
    cancelAnimationFrame(animationFrameId)
    window.removeEventListener('resize', handleResize)
  })
})
</script>

<template>
  <canvas ref="canvasRef" class="fixed inset-0 pointer-events-none z-[-1] opacity-60"></canvas>
</template>
