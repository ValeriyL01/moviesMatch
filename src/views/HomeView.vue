<script setup lang="ts">
import { useMoviesStore } from '@/stores/movies'
import { ref } from 'vue'
import { movieTitles } from '@/data/movieTitles'
import GameMenu from '@/components/GameMenu.vue'
import LoadingScreen from '@/components/LoadingScreen.vue'
import MovieCard from '@/components/MovieCard.vue'
import AnswerButtons from '@/components/AnswerButtons.vue'
import { useToast } from 'primevue/usetoast'
const toast = useToast()
const moviesStore = useMoviesStore()
const answers = ref<string[]>([])
const isAnswerChecked = ref<boolean>(false)
const selectedAnswer = ref<string | null>(null)
const loading = ref<boolean>(false)
const counterCorrectAnswers = ref<number>(0)
const isImageLoaded = ref<boolean>(false)
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
  selectedAnswer.value = null
  isAnswerChecked.value = false
  answers.value = []
}

const fetchRandomMovie = async (attempts: number = 5): Promise<void> => {
  if (attempts <= 0) {
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: 'Не удалось загрузить фильм после нескольких попыток',
      life: 3000,
    })
    return
  }

  loading.value = true
  resetDataAnswer()
  isImageLoaded.value = false

  try {
    await moviesStore.getMovie()
    createAnswers()

    const image = new Image()
    image.src = moviesStore.movieData.imageUrl || ''
    image.onload = () => {
      isImageLoaded.value = true
      loading.value = false
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Ошибка при загрузке фильма:', error)

      if (error.message === 'Нет доступных изображений') {
        await fetchRandomMovie(attempts - 1)
      }
    }
    loading.value = false
  }
}

const checkAnswer = (option: string) => {
  if (isAnswerChecked.value) return
  selectedAnswer.value = option
  if (selectedAnswer.value === moviesStore.movieData.name) {
    counterCorrectAnswers.value++
  }
  isAnswerChecked.value = true

  setTimeout(() => {
    fetchRandomMovie()
  }, 1000)
}

const newGame = () => {
  fetchRandomMovie()
  counterCorrectAnswers.value = 0
}
</script>

<template>
  <app-toast position="bottom-right" />
  <div class="movie-details">
    <h1>Угадай фильм по кадру</h1>

    <GameMenu :counter-correct-answers="counterCorrectAnswers" @start-new-game="newGame" />

    <LoadingScreen v-if="loading" />

    <div class="game-container" v-else-if="isImageLoaded">
      <MovieCard
        v-if="moviesStore.movieData.imageUrl && moviesStore.movieData.name"
        :image-url="moviesStore.movieData.imageUrl"
        :name="moviesStore.movieData.name"
      />
      <AnswerButtons
        :answers="answers"
        :is-answer-checked="isAnswerChecked"
        :selected-answer="selectedAnswer"
        :correct-answer="moviesStore.movieData.name || ''"
        @select-answer="checkAnswer"
      />
    </div>
  </div>
</template>

<style scoped>
.movie-details {
  text-align: center;
  width: 750px;
}

.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 750px;
  margin: 0 auto;
  min-height: 450px;
  animation: increase 0.4s;
}
h1 {
  color: #ebebeb;
}

@keyframes increase {
  0% {
    transform: scale(0);
  }
  10% {
    transform: scale(0.1);
  }
  20% {
    transform: scale(0.2);
  }
  30% {
    transform: scale(0.3);
  }
  40% {
    transform: scale(0.4);
  }
  50% {
    transform: scale(0.5);
  }
  60% {
    transform: scale(0.6);
  }
  70% {
    transform: scale(0.7);
  }
  80% {
    transform: scale(0.8);
  }
  90% {
    transform: scale(0.9);
  }
  90% {
    transform: scale(1);
  }
}
</style>
