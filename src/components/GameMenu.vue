<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  counterCorrectAnswers: number
}>()

const emit = defineEmits<{
  (e: 'startNewGame'): void
}>()

const prevCounter = ref(props.counterCorrectAnswers)

const isAnimating = ref(false)

watch(
  () => props.counterCorrectAnswers,
  (newValue, oldValue) => {
    if (newValue > oldValue) {
      isAnimating.value = true

      prevCounter.value = oldValue

      setTimeout(() => {
        isAnimating.value = false
      }, 500)
    }
  },
)
</script>

<template>
  <div class="game-menu">
    <button @click="emit('startNewGame')">Начать новую игру</button>
    <h4>
      Правильные ответы:
      <span class="counter" :class="{ animate: isAnimating }">
        {{ props.counterCorrectAnswers }}
      </span>
    </h4>
  </div>
</template>

<style scoped>
.game-menu {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.5rem;
}
h4 {
  margin-bottom: 5px;
}
.counter {
  display: inline-block;
  transition: all 0.5s;
}

.counter.animate {
  animation: counterAnimation 0.5s;
}

@keyframes counterAnimation {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
    color: #4caf50; /* Зеленый цвет */
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
  .counter {
    font-size: 1.5rem;
  }
}
@media (max-width: 500px) {
  .game-menu {
    font-size: 1rem;
  }
  .counter {
    font-size: 1.2rem;
  }
}
</style>
