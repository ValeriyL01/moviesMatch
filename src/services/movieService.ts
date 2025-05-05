import { getRandomNumber } from '@/utils/getRandomNumber'

const BASE_URL = 'https://kinopoiskapiunofficial.tech/api/v2.2/films'
const API_KEY = '23092107-34ed-4232-a087-98b022dc89b1'
type Movie = {
  name: string
  movieId: number
}
export const getMovieImages = async (movieId: number | null): Promise<string | null> => {
  try {
    const response = await fetch(`${BASE_URL}/${movieId}/images`, {
      method: 'GET',
      headers: {
        'X-API-KEY': API_KEY,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`)
    }

    const data = await response.json()

    if (data.items.length === 0) {
      throw new Error('Нет доступных изображений')
    }
    const randomImage = data.items[getRandomNumber(data.items.length)]
    if (!randomImage) {
      return randomImage.data.items[0].imageUrl
    }
    return randomImage.imageUrl
  } catch (error) {
    console.error('Ошибка при получении изображений:', error)
    throw error
  }
}

export const getRandomMovie = async (
  pageNumber: number,
  collectionType: string,
): Promise<Movie | null> => {
  try {
    const response = await fetch(
      `${BASE_URL}/collections?type=${collectionType}&page=${pageNumber}`,
      {
        method: 'GET',
        headers: {
          'X-API-KEY': API_KEY,
          'Content-Type': 'application/json',
        },
      },
    )

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`)
    }

    const data = await response.json()

    const movies = data.items
    if (!movies || movies.length === 0) {
      throw new Error('Нет доступных фильмов')
    }

    const randomMovie = movies[getRandomNumber(movies.length)]

    return { name: randomMovie.nameRu, movieId: randomMovie.kinopoiskId }
  } catch (error) {
    console.error('Ошибка при получении случайного фильма:', error)
    throw error
  }
}
