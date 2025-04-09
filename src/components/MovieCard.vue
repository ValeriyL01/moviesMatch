<script setup lang="ts">
defineProps<{
  imageUrl: string
  name: string
}>()
</script>

<template>
  <div class="movie-card">
    <img :src="imageUrl" :alt="name" class="poster" />
  </div>
</template>

<style scoped>
.movie-card {
  margin-top: 20px;
}
.poster {
  width: 100%;
  max-height: 450px;
  object-fit: cover;
  border-radius: 8px;
  margin-top: 10px;
}
</style>
