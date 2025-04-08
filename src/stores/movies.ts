import { defineStore } from 'pinia'
import { ref } from 'vue'
import { movieTitles } from '@/data/movieTitles'
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
    const randomMovie = await getRandomMovie()
    if (randomMovie !== null) {
      movieData.value = {
        name: randomMovie.name || 'Название неизвестно',
        movieId: randomMovie.movieId,
        imageUrl: null,
      }
    }
    const imageUrl = await getMovieImages(movieData.value.movieId)
    movieData.value.imageUrl = imageUrl
  }

  return { movieData, getMovie }
})
