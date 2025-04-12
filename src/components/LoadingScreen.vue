<template>
  <div class="loading-container">
    <p>Загрузка фильма...</p>
  </div>
</template>

<style scoped>
.loading-container {
  font-size: 2rem;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 750px;
  margin: 0 auto;
}
.loading-container p {
  margin-top: 250px;
}

@media (max-width: 800px) {
  .loading-container {
    width: 100%;
    font-size: 1.5rem;
  }
  .loading-container p {
    margin-top: 130px;
  }
}
</style>
