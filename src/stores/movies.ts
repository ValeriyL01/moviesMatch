import { defineStore } from 'pinia'
import { ref } from 'vue'

import { getRandomMovie, getMovieImages } from '@/services/movieService'
import { DifficultyLevel } from '@/types/types'

enum CollectionType {
  Top250Movies = 'TOP_250_MOVIES',
  TopPopularMovies = 'TOP_POPULAR_MOVIES',
}
type MovieData = {
  name: string | null
  movieId: number | null
  imageUrl: string | null
}
export const useMoviesStore = defineStore('movies', () => {
  const movieData = ref<MovieData>({
    name: null,
    movieId: null,
    imageUrl: null,
  })
  const difficultyGame = ref<DifficultyLevel>(DifficultyLevel.Beginner)
  const isBlackPicture = ref(false)
  const isTime = ref(false)
  const moviesToWin = ref(50)
  const counterCorrectAnswers = ref(0)
  const totalAnswers = ref(0)
  const getMovie = async (difficulty: DifficultyLevel) => {
    let collectionType: CollectionType
    let pageCount: number

    if (difficulty === DifficultyLevel.Beginner) {
      collectionType = CollectionType.Top250Movies
      pageCount = 13
    } else if (difficulty === DifficultyLevel.MovieFan) {
      collectionType = CollectionType.TopPopularMovies
      pageCount = 35
    } else {
      throw new Error('Неверная сложность игры')
    }
    const randomPage = (pageCount: number): number => {
      return Math.floor(Math.random() * pageCount) + 1
    }

    try {
      const randomMovie = await getRandomMovie(randomPage(pageCount), collectionType)
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

  return {
    movieData,
    getMovie,
    difficultyGame,
    isBlackPicture,
    isTime,
    moviesToWin,
    counterCorrectAnswers,
    totalAnswers,
  }
})
