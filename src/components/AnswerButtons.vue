<script setup lang="ts">
defineProps<{
  answers: string[]
  isAnswerChecked: boolean
  selectedAnswer: string | null
  correctAnswer: string
}>()

const emit = defineEmits<{
  (e: 'selectAnswer', answer: string): void
}>()
</script>

<template>
  <div class="playgroundAnswers">
    <button
      v-for="(answer, index) in answers"
      :key="index"
      @click="emit('selectAnswer', answer)"
      :class="{
        buttonAnswer: true,
        correct: isAnswerChecked && answer === correctAnswer,
        incorrect: isAnswerChecked && answer !== correctAnswer && selectedAnswer === answer,
      }"
    >
      {{ answer }}
    </button>
  </div>
</template>

<style scoped>
.playgroundAnswers {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
  width: 100%;
}

.buttonAnswer {
  width: 49%;
  height: 50px;
  padding: 10px;

  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
  color: #ffffff;
  font-size: 1.2rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

button.correct {
  background-color: rgb(110, 255, 129);
  animation: bounce 0.5s ease;
}

button.incorrect {
  background-color: rgb(254, 114, 114);
  animation: shake 0.5s ease;
}

button:active {
  transform: scale(0.9);
}
@keyframes bounce {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes shake {
  0% {
    transform: rotate(0deg);
  }
  10% {
    transform: rotate(4deg);
  }
  20% {
    transform: rotate(0deg);
  }
  30% {
    transform: rotate(-4deg);
  }
  40% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(4deg);
  }
  60% {
    transform: rotate(0deg);
  }
  70% {
    transform: rotate(-4deg);
  }
  80% {
    transform: rotate(0deg);
  }
  90% {
    transform: rotate(4deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
@media (max-width: 800px) {
  .buttonAnswer {
    width: 100%;
  }
}
@media (max-width: 500px) {
  .buttonAnswer {
    font-size: 1rem;
  }
}
@media (max-width: 400px) {
  .buttonAnswer {
    font-size: 0.9rem;
  }
}
</style>
