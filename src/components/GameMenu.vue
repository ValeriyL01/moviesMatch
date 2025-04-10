<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  counterCorrectAnswers: number
}>()

const emit = defineEmits<{
  (e: 'startNewGame'): void
}>()

const prevCounter = ref(props.counterCorrectAnswers)

watch(
  () => props.counterCorrectAnswers,
  (newValue, oldValue) => {
    if (newValue > oldValue) {
      prevCounter.value = oldValue
    }
  },
)
</script>

<template>
  <div class="game-menu">
    <button @click="emit('startNewGame')">Начать новую игру</button>
    <h4>
      Правильные ответы:
      <span class="counter" :class="{ animate: props.counterCorrectAnswers > prevCounter }">
        {{ counterCorrectAnswers }}
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
    color: #4caf50;
  }
  100% {
    transform: scale(1);
  }
}
</style>
