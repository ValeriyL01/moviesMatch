<script setup lang="ts">
defineProps<{
  counterCorrectAnswers: number
}>()

const emit = defineEmits<{
  (e: 'startNewGame'): void
}>()
</script>

<template>
  <div class="game-menu">
    <button @click="emit('startNewGame')">Начать новую игру</button>
    <h4>Правильные ответы: {{ counterCorrectAnswers }}</h4>
  </div>
</template>

<style scoped>
.game-menu {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.5rem;
}
</style>
