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
    <div class="sliderContainer">
      <h4>Количество угаданных фильмов для победы</h4>
      <div class="sliderWrapper">
        <Slider :max="100" :min="10" v-model="moviesStore.moviesToWin" class="custom-slider" />
        <span class="sliderValue">{{ moviesStore.moviesToWin }}</span>
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
}
.checkbox {
  display: flex;
  gap: 10px;
}
.custom-select-button button:hover {
  opacity: 1;
}
.sliderContainer {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  padding: 15px;
}

.sliderContainer h4 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #ebebeb;
}

.sliderWrapper {
  display: flex;
  align-items: center;
  gap: 30px;
  width: 100%;
}

.custom-slider {
  flex-grow: 1;
}

.sliderValue {
  font-size: 1.1rem;
  font-weight: 600;
  color: #343634;
  background-color: #ebebeb;
  text-align: center;
  padding-top: 5px;
  padding-bottom: 5px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 50px;
  height: 30px;
}
@media (max-width: 800px) {
  .startGameButton {
    font-size: 1.5rem;
  }
}
</style>
