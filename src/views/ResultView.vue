<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useMoviesStore } from '@/stores/movies'
import { ref, onMounted, computed } from 'vue'
import { Fireworks } from 'fireworks-js'
const moviesStore = useMoviesStore()
const router = useRouter()
const fireworkContainer = ref<HTMLElement | null>(null)
let fireworksInstance: Fireworks | null = null
const chartData = computed(() => ({
  labels: ['Правильные ответы', 'Всего ответов'], // Оси X
  datasets: [
    {
      label: 'Статистика игры',
      backgroundColor: ['#4caf50', '#ff9800'], // Цвета столбцов
      data: [moviesStore.counterCorrectAnswers, moviesStore.totalAnswers], // Значения
    },
  ],
}))
const chartOptions = ref({
  responsive: true, // Адаптивность
  maintainAspectRatio: false, // Отключение фиксированного соотношения сторон
  plugins: {
    legend: {
      display: true,
      position: 'top',
      labels: {
        color: '#ebebeb', // Цвет текста легенды
        font: {
          size: 16, // Размер текста легенды
        },
      },
    },
    title: {
      color: '#ebebeb',
      display: true, // Показать заголовок
      text: 'Статистика игры', // Текст заголовка
      font: {
        size: 20, // Размер шрифта заголовка
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false, // Скрыть сетку по оси X
      },
      ticks: {
        color: '#ebebeb',
        font: {
          size: 14, // Размер шрифта заголовка
        },
        maxRotation: 0, // Отключаем поворот текста
        autoSkip: false, // Автоматический пропуск подписей, если они не помещаются
      },
    },
    y: {
      beginAtZero: true, // Начинать ось Y с нуля
      grid: {
        color: '#e0e0e0', // Цвет сетки по оси Y
      },
    },
  },
})
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

const stopFireworkAnimation = (): void => {
  if (fireworksInstance) {
    fireworksInstance.stop()
    fireworksInstance = null
  }

  if (fireworkContainer.value) {
    fireworkContainer.value.innerHTML = ''
  }
}

onMounted(() => {
  startFireworkAnimation()
  setTimeout(() => {
    stopFireworkAnimation()
  }, 10000)
})

const getStartView = (): void => {
  router.push('/')
}
</script>

<template>
  <div class="container">
    <h2>Поздравляем! Вы прошли игру!</h2>

    <Chart type="bar" :data="chartData" :options="chartOptions" class="chart-container" />
    <button @click="getStartView">Начать новую игру</button>
    <div ref="fireworkContainer" class="firework-container"></div>
  </div>
</template>

<style scoped>
.container {
  align-items: center;
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
.chart-container {
  width: 100%;
  max-width: 500px;

  height: 350px;
}

@media (max-width: 800px) {
  .chart-container {
    max-width: 370px;
  }
}
@media (max-width: 500px) {
  .chart-container {
    max-width: 300px;
    height: 300px;
  }
}
</style>
