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

  const getMovie = async () => {
    try {
      const randomMovie = await getRandomMovie()
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

  return { movieData, getMovie }
})
