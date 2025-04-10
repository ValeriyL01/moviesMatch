<script setup lang="ts">
import SelectButton from 'primevue/selectbutton'

import { useRouter } from 'vue-router'
import { useMoviesStore } from '@/stores/movies'

const router = useRouter()
const moviesStore = useMoviesStore()
</script>

<template>
  <div class="container">
    <h2>Выберете сложность игры</h2>
    <SelectButton
      v-model="moviesStore.difficultyGame"
      :options="['легко', 'сложно']"
      size="large"
      defaultValue="легко"
      class="custom-select-button"
    />
    <button @click="router.push('/game')">Начать игру</button>
  </div>
</template>

<style>
.container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
