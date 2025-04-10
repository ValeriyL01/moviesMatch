import { defineStore } from 'pinia'
import { ref } from 'vue'

import { getRandomMovie, getMovieImages } from '@/services/movieService'
export const useMoviesStore = defineStore('movies', () => {
  const movieData = ref<{
    name: string | null
    movieId: number | null
    imageUrl: string | null
  }>({
    name: null,
    movieId: null,
    imageUrl: null,
  })
  const difficultyGame = ref('легко')

  const getMovie = async (difficulty: string) => {
    let collectionType: string
    let pageCount: number

    if (difficulty === 'легко') {
      collectionType = 'TOP_250_MOVIES'
      pageCount = 13
    } else if (difficulty === 'сложно') {
      collectionType = 'TOP_POPULAR_MOVIES'
      pageCount = 35
    } else {
      throw new Error('Неверная сложность игры')
    }
    const randomPage = () => {
      return Math.floor(Math.random() * pageCount) + 1
    }

    try {
      const randomMovie = await getRandomMovie(randomPage(), collectionType)
      if (!randomMovie) {
        throw new Error('Не удалось получить случайный фильм')
      }

      movieData.value = {
        name: randomMovie.name || 'Название неизвестно',
        movieId: randomMovie.movieId,
        imageUrl: null,
      }

      const imageUrl = await getMovieImages(movieData.value.movieId)
      movieData.value.imageUrl = imageUrl
    } catch (error) {
      console.error('Ошибка при загрузке фильма:', error)
      throw error
    }
  }

  return { movieData, getMovie, difficultyGame }
})
