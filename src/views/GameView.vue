<script setup lang="ts">
import { useMoviesStore } from '@/stores/movies'
import { onMounted, ref } from 'vue'
import { movieTitles } from '@/data/movieTitles'
import GameMenu from '@/components/GameMenu.vue'
import LoadingScreen from '@/components/LoadingScreen.vue'
import MovieCard from '@/components/MovieCard.vue'
import AnswerButtons from '@/components/AnswerButtons.vue'
import { useToast } from 'primevue/usetoast'
import { Fireworks } from 'fireworks-js'
import { useRouter } from 'vue-router'
import ProgressBar from '@/components/ProgressBar.vue'
const fireworkContainer = ref<HTMLElement | null>(null)
let fireworksInstance: Fireworks | null = null
const router = useRouter()
const toast = useToast()
const moviesStore = useMoviesStore()
const answers = ref<string[]>([])
const isAnswerChecked = ref<boolean>(false)
const selectedAnswer = ref<string | null>(null)
const loading = ref<boolean>(false)
const counterCorrectAnswers = ref<number>(0)
const counterCorrectAnswersInRow = ref<number>(0)
const isImageLoaded = ref<boolean>(false)

const startFireworkAnimation = () => {
  // Останавливаем и уничтожаем предыдущий экземпляр Fireworks
  if (fireworksInstance) {
    fireworksInstance.stop()
    fireworksInstance = null
  }

  // Очищаем контейнер для фейерверков
  if (fireworkContainer.value) {
    fireworkContainer.value.innerHTML = '' // Очистка содержимого контейнера
  }

  // Создаем новый экземпляр Fireworks
  if (fireworkContainer.value) {
    fireworksInstance = new Fireworks(fireworkContainer.value, {
      acceleration: 1.05,
      friction: 0.97,
      gravity: 1.5,
      particles: 50,
      explosion: 5,
      intensity: 30,
      flickering: 50,
      lineStyle: 'round',
      hue: {
        min: 0,
        max: 360,
      },
      delay: {
        min: 30,
        max: 60,
      },
    })

    fireworksInstance.start()
  }
}

const stopFireworkAnimation = () => {
  if (fireworksInstance) {
    fireworksInstance.stop()
    fireworksInstance = null
  }

  if (fireworkContainer.value) {
    fireworkContainer.value.innerHTML = ''
  }
}
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

const congratulation = () => {
  if (counterCorrectAnswersInRow.value === 10) {
    toast.add({
      severity: 'success',
      summary: 'Ура!',
      detail: 'Поздравляем! Вы ответили верно 10 раз подряд!',
      life: 5000,
    })
    counterCorrectAnswersInRow.value = 0

    startFireworkAnimation()

    setTimeout(() => {
      stopFireworkAnimation()
    }, 5000)
  }
}

const fetchRandomMovie = async (): Promise<void> => {
  loading.value = true
  isImageLoaded.value = false
  resetDataAnswer()
  try {
    await moviesStore.getMovie(moviesStore.difficultyGame)
    createAnswers()
    const image = new Image()
    image.src = moviesStore.movieData.imageUrl || ''
    image.onload = () => {
      isImageLoaded.value = true
      loading.value = false
    }
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

const checkAnswer = (option: string) => {
  if (isAnswerChecked.value) return
  selectedAnswer.value = option

  if (selectedAnswer.value === moviesStore.movieData.name) {
    counterCorrectAnswers.value++
    counterCorrectAnswersInRow.value++
  } else {
    counterCorrectAnswersInRow.value = 0
  }

  isAnswerChecked.value = true
  congratulation()

  setTimeout(() => {
    fetchRandomMovie()
  }, 500)
}

const newGame = () => {
  fetchRandomMovie()
  counterCorrectAnswers.value = 0
  counterCorrectAnswersInRow.value = 0
}
onMounted(() => {
  newGame()
})
</script>

<template>
  <app-toast position="bottom-center" />

  <div class="game">
    <div ref="fireworkContainer" class="firework-container"></div>

    <GameMenu :counter-correct-answers="counterCorrectAnswers" @start-new-game="router.push('/')" />

    <LoadingScreen v-if="loading" />

    <div class="game-container" v-else-if="isImageLoaded">
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

.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 750px;
  margin: 0 auto;
  min-height: 450px;
  animation: increase 0.3s;
  margin-top: 30px;
}

.firework-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 9999;
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
@media (max-width: 800px) {
  .game-container {
    min-height: 400px;
    padding: 1rem;
    margin-top: 10px;
  }
}
@media (max-width: 500px) {
  .game-container {
    min-height: 350px;
    padding: 0.5rem;
    margin-top: 5px;
  }
}
@media (max-width: 400px) {
  .game-container {
    min-height: 300px;
    padding: 0.5rem;
    margin-top: 3px;
  }
}
</style>
