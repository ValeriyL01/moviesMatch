<script setup lang="ts">
import { useMoviesStore } from '@/stores/movies'
import { onMounted, ref } from 'vue'
import { movieTitles } from '@/data/movieTitles'
import GameMenu from '@/components/GameMenu.vue'
import LoadingScreen from '@/components/LoadingScreen.vue'
import MovieCard from '@/components/MovieCard.vue'
import AnswerButtons from '@/components/AnswerButtons.vue'
import { useToast } from 'primevue/usetoast'

import { useRouter } from 'vue-router'
import ProgressBar from '@/components/ProgressBar.vue'
import { getRandomNumber } from '@/utils/getRandomNumber'

const router = useRouter()
const toast = useToast()
const moviesStore = useMoviesStore()
const answers = ref<string[]>([])
const isAnswerChecked = ref<boolean>(false)
const selectedAnswer = ref<string | null>(null)
const loading = ref<boolean>(false)
const counterCorrectAnswersInRow = ref<number>(0)
const isImageLoaded = ref<boolean>(false)
type RandomMovieTitlesResult = {
  randomTitles: string[]
}
const getRandomMovieTitles = (): RandomMovieTitlesResult => {
  const filteredTitles = movieTitles.filter((title) => title !== moviesStore.movieData.name)
  const randomTitles = []
  const numberIncorrectAnswers = 3
  for (let i = 0; i < numberIncorrectAnswers; i++) {
    const randomIndex = getRandomNumber(filteredTitles.length)
    randomTitles.push(filteredTitles[randomIndex])
    filteredTitles.splice(randomIndex, 1)
  }

  return { randomTitles }
}

const createAnswers = (): void => {
  const maxAnswersCount = 4
  const { randomTitles } = getRandomMovieTitles()
  const correctAnswer = moviesStore.movieData.name!
  const randomIndex = getRandomNumber(maxAnswersCount)
  answers.value = [...randomTitles]
  answers.value.splice(randomIndex, 0, correctAnswer)
}

const resetDataAnswer = (): void => {
  selectedAnswer.value = null
  isAnswerChecked.value = false
  answers.value = []
}

const congratulation = (): void => {
  if (counterCorrectAnswersInRow.value === 10) {
    toast.add({
      severity: 'success',
      summary: 'Ура!',
      detail: 'Поздравляем! Вы ответили верно 10 раз подряд!',
      life: 5000,
    })
    counterCorrectAnswersInRow.value = 0
  }
}
const loadImage = (imageUrl: string | null): void => {
  const image = new Image()
  image.src = imageUrl || ''

  image.onload = () => {
    isImageLoaded.value = true
    loading.value = false
  }
}
const fetchRandomMovie = async (): Promise<void> => {
  loading.value = true
  isImageLoaded.value = false
  resetDataAnswer()
  try {
    await moviesStore.getMovie(moviesStore.difficultyGame)
    createAnswers()
    loadImage(moviesStore.movieData.imageUrl)
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Ошибка HTTP: 402') {
        toast.add({
          severity: 'error',
          summary: 'Ошибка',
          detail: 'Превышен лимит запросов к серверу в сутки.',
          life: 3000,
        })
      }

      if (error.message === 'Нет доступных изображений') {
        await fetchRandomMovie()
      }
    }
  }
}

const handleCorrectAnswer = (): void => {
  moviesStore.counterCorrectAnswers++
  counterCorrectAnswersInRow.value++

  if (moviesStore.counterCorrectAnswers === moviesStore.moviesToWin) {
    setTimeout(() => {
      router.push('/result')
    }, 700)
  }
}

const handleIncorrectAnswer = (): void => {
  counterCorrectAnswersInRow.value = 0
}

const resetAndFetchNewMovie = (): void => {
  isAnswerChecked.value = true
  congratulation()

  setTimeout(() => {
    fetchRandomMovie()
  }, 700)
}

const checkAnswer = (answer: string): void => {
  if (isAnswerChecked.value) return

  selectedAnswer.value = answer
  moviesStore.totalAnswers++

  if (selectedAnswer.value === moviesStore.movieData.name) {
    handleCorrectAnswer()
  } else {
    handleIncorrectAnswer()
  }

  resetAndFetchNewMovie()
}
const newGame = () => {
  fetchRandomMovie()
  moviesStore.counterCorrectAnswers = 0
  counterCorrectAnswersInRow.value = 0
  moviesStore.totalAnswers = 0
}
onMounted(() => {
  newGame()
})
</script>

<template>
  <app-toast position="bottom-center" />

  <div class="game">
    <GameMenu @start-new-game="router.push('/')" />

    <LoadingScreen v-if="loading" />

    <div class="gameContainer" v-else-if="isImageLoaded">
      <ProgressBar v-if="moviesStore.isTime" :time="10" @onComplete="fetchRandomMovie" />
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
.game {
  text-align: center;
  width: 100%;
  max-width: 750px;
  margin: 0 auto;
}

.gameContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 750px;
  margin: 0 auto;
  min-height: 450px;
  animation: increase 0.3s;
  margin-top: 10px;
}

@keyframes increase {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}
@media (max-width: 800px) {
  .gameContainer {
    min-height: 400px;
    padding: 1rem;
    margin-top: 10px;
  }
}
@media (max-width: 500px) {
  .gameContainer {
    min-height: 350px;
    padding: 0.5rem;
    margin-top: 5px;
  }
}
@media (max-width: 400px) {
  .gameContainer {
    min-height: 300px;
    padding: 0.5rem;
    margin-top: 3px;
  }
}
</style>
