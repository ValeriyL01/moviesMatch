<script setup lang="ts">
import SelectButton from 'primevue/selectbutton'

import { useRouter } from 'vue-router'
import { useMoviesStore } from '@/stores/movies'

const router = useRouter()
const moviesStore = useMoviesStore()
</script>

<template>
  <div class="container">
    <h2>Выберите сложность игры</h2>
    <SelectButton
      v-model="moviesStore.difficultyGame"
      :options="['новичок', 'киноман']"
      size="large"
      defaultValue="новичок"
      class="custom-select-button"
    />

    <div class="checkboxContainer">
      <div class="checkbox">
        <CheckboxButton v-model="moviesStore.isBlackPicture" binary />
        <label>черно-белые кадры</label>
      </div>
      <div class="checkbox">
        <CheckboxButton v-model="moviesStore.isTime" binary />
        <label>10 секунд на вопрос </label>
      </div>
    </div>

    <button class="startGameButton" @click="router.push('/game')">Начать игру</button>
  </div>
</template>

<style>
.container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.checkboxContainer {
  display: flex;
  flex-direction: column;

  align-items: flex-start;
  gap: 10px;
  font-size: 1.1rem;
  font-weight: 500;
  margin-top: 5px;
  margin-bottom: 30px;
}
.checkbox {
  display: flex;
  gap: 10px;
}
.custom-select-button button:hover {
  opacity: 1;
}

@media (max-width: 800px) {
  .startGameButton {
    font-size: 1.5rem;
  }
}
</style>
