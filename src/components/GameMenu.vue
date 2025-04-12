<script setup lang="ts">
import { computed } from 'vue'
import { useMoviesStore } from '@/stores/movies'
const moviesStore = useMoviesStore()

const emit = defineEmits<{
  (e: 'startNewGame'): void
}>()

const progressWidth = computed(() => {
  return (moviesStore.counterCorrectAnswers / moviesStore.moviesToWin) * 100
})
</script>

<template>
  <div class="game-menu">
    <button @click="emit('startNewGame')">Начать новую игру</button>
    <div class="progress-container">
      <div class="progress-bar" :style="{ width: progressWidth + '%' }"></div>
      <div class="progress-text">
        {{ moviesStore.counterCorrectAnswers }}/{{ moviesStore.moviesToWin }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.game-menu {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.5rem;
  gap: 10px;
}

.progress-container {
  position: relative;
  width: 50%;
  height: 48px;
  background-color: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: #82d185;
  transition: width 0.3s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.1rem;
  font-weight: bold;
  color: #343634;
  z-index: 1;
  pointer-events: none;
}
@keyframes counterAnimation {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
    color: #4caf50;
  }
  100% {
    transform: scale(1);
  }
}

@media (max-width: 800px) {
  .game-menu {
    flex-direction: column;
    font-size: 1.2rem;
  }
  .progress-container {
    height: 42px;
  }
}
@media (max-width: 500px) {
  .game-menu {
    font-size: 1rem;
  }
}
</style>
