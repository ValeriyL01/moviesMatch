<script setup lang="ts">
import { useMoviesStore } from '@/stores/movies'

const moviesStore = useMoviesStore()

defineProps<{
  imageUrl: string
  name: string
}>()
</script>

<template>
  <div class="movie-card">
    <img
      :src="imageUrl"
      :alt="name"
      class="poster"
      :class="{ blackImg: moviesStore.isBlackPicture }"
    />
  </div>
</template>

<style scoped>
.poster {
  width: 100%;
  max-height: 500px;
  object-fit: cover;
  border-radius: 8px;
  margin-top: 10px;
}
.blackImg {
  filter: grayscale(100%);
}

/* @media (max-width: 800px) {
  .poster {
    max-height: 400px;
  }
}
@media (max-width: 500px) {
  .poster {
    max-height: 350px;
  }
} */
</style>
