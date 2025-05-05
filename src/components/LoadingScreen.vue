<template>
  <div class="loadingContainer">
    <p>Загрузка фильма...</p>
  </div>
</template>

<style scoped>
.loadingContainer {
  font-size: 2rem;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 750px;
  margin: 0 auto;
}
.loadingContainer p {
  margin-top: 250px;
}

@media (max-width: 800px) {
  .loadingContainer {
    width: 100%;
    font-size: 1.5rem;
  }
  .loadingContainer p {
    margin-top: 130px;
  }
}
</style>
