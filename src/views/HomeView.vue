<script setup lang="ts">
import { useMoviesStore } from '@/stores/movies'
import { ref } from 'vue'
import { movieTitles } from '@/data/movieTitles'
const moviesStore = useMoviesStore()
const answers = ref<string[]>([])
const isAnswerChecked = ref<boolean>(false)
const selectedAnswer = ref<string | null>(null)
const loading = ref<boolean>(false)

const getRandomMovieTitles = (): string[] => {
  const filteredTitles = movieTitles.filter((title) => title !== moviesStore.movieData.name)
  const randomTitles = []
  for (let i = 0; i < 3; i++) {
    const randomIndex = Math.floor(Math.random() * filteredTitles.length)
    randomTitles.push(filteredTitles[randomIndex])
    filteredTitles.splice(randomIndex, 1)
  }
  return randomTitles
}

const createAnswers = () => {
  const correctAnswer = moviesStore.movieData.name!
  const randomIndex = Math.floor(Math.random() * 4)
  answers.value = [...getRandomMovieTitles()]
  answers.value.splice(randomIndex, 0, correctAnswer)
}
const resetDataAnswer = () => {
  loading.value = true
  selectedAnswer.value = null
  isAnswerChecked.value = false
  answers.value = []
}
const fetchRandomMovie = async () => {
  resetDataAnswer()
  await moviesStore.getMovie()
  createAnswers()
  loading.value = false
}

const checkAnswer = (option: string) => {
  if (isAnswerChecked.value) return

  selectedAnswer.value = option
  isAnswerChecked.value = true

  setTimeout(() => {
    fetchRandomMovie()
  }, 2000)
}
</script>

<template>
  <div class="movie-details">
    <h1>Угадай фильм по кадру</h1>

    <button @click="fetchRandomMovie">Начать</button>
    <div v-if="loading" class="loading-container">
      <p>Загрузка фильма...</p>
    </div>

    <div class="game-container" v-if="loading === false">
      <div class="movie-card" v-if="moviesStore.movieData.imageUrl && moviesStore.movieData.name">
        <img
          :src="moviesStore.movieData.imageUrl"
          :alt="moviesStore.movieData.name"
          class="poster"
        />
      </div>
      <div class="playground-answers">
        <button
          v-for="(answer, index) in answers"
          :key="index"
          @click="checkAnswer(answer)"
          :class="{
            'button-answer': true,
            correct: isAnswerChecked && answer === moviesStore.movieData.name,
            incorrect:
              isAnswerChecked && answer !== moviesStore.movieData.name && selectedAnswer === answer,
          }"
        >
          {{ answer }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.movie-details {
  text-align: center;
}
.movie-card {
  margin-top: 20px;
}
.poster {
  max-height: 450px;
  width: 100%;
  object-fit: cover;
  border-radius: 8px;
  margin-top: 10px;
}
.playground-answers {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
  width: 100%;
}
button {
  padding: 10px;
  background-color: rgb(36, 70, 138);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
  color: #ffffff;
  font-size: 1.5rem;
}
.button-answer {
  width: 49%;

  height: 50px;
}
button.correct {
  background-color: rgb(110, 255, 129);
  animation: bounce 0.5s ease;
}

button.incorrect {
  background-color: rgb(254, 114, 114);
  animation: shake 0.3s ease;
}
button:active {
  transform: scale(0.9);
}
button:hover {
  opacity: 0.9;
}

.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 450px;
  font-size: 2rem;
  color: white;
}
.game-container {
  animation: increase 0.5s ease;
}
h1 {
  color: #ebebeb;
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

@keyframes increase {
  0% {
    transform: scale(0);
  }
  25% {
    transform: scale(0.3);
  }
  50% {
    transform: scale(0.5);
  }
  75% {
    transform: scale(0.7);
  }
  100% {
    transform: scale(1);
  }
}
</style>
