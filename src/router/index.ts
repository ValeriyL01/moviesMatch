import { createRouter, createWebHistory } from 'vue-router'
import GameView from '../views/GameView.vue'
import StartView from '@/views/StartView.vue'
import ResultView from '@/views/ResultView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/game',
      name: 'game',
      component: GameView,
    },
    {
      path: '/',
      name: 'start',

      component: StartView,
    },

    {
      path: '/result',
      name: 'result',

      component: ResultView,
    },
  ],
})

export default router
