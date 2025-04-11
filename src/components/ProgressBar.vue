<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

const props = defineProps<{
  time: number
}>()
const emit = defineEmits<{
  (e: 'onComplete'): void
}>()

const timeLeft = ref(props.time)
const progressWidth = ref(100)
const isTransitionDisabled = ref(false)
let animationFrameId: number | null = null

const startAnimation = () => {
  const start = performance.now()
  const duration = props.time * 1000

  const animate = (timestamp: number) => {
    const elapsed = timestamp - start
    const progress = Math.max(0, 1 - elapsed / duration)
    progressWidth.value = progress * 100
    timeLeft.value = Math.round(progress * props.time)

    if (elapsed < duration) {
      animationFrameId = requestAnimationFrame(animate)
    } else {
      stopAnimation()
      emit('onComplete')
      resetAndRestart()
    }
  }

  animationFrameId = requestAnimationFrame(animate)
}

const stopAnimation = () => {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
}

const resetAndRestart = () => {
  isTransitionDisabled.value = true

  timeLeft.value = props.time
  progressWidth.value = 100

  setTimeout(() => {
    isTransitionDisabled.value = false
    startAnimation()
  }, 0)
}

const computedBackgroundColor = computed(() => {
  const progress = progressWidth.value / 100
  const red = Math.round(125 + (255 - 125) * (1 - progress))
  const green = Math.round(230 - (230 - 66) * (1 - progress))
  const blue = Math.round(111 - (111 - 66) * (1 - progress))
  return `rgb(${red}, ${green}, ${blue})`
})
onMounted(() => {
  startAnimation()
})
</script>

<template>
  <div class="progress-container">
    <div
      class="progress-bar"
      :class="{ 'no-transition': isTransitionDisabled }"
      :style="{ width: progressWidth + '%', backgroundColor: computedBackgroundColor }"
    ></div>
  </div>
</template>

<style scoped>
.progress-container {
  position: relative;
  width: 100%;
  height: 13px;
  background-color: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: rgb(125, 230, 111);
  transition: width 0.3s ease;
}

.progress-bar.no-transition {
  transition: none;
}
</style>
