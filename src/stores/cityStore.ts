import { defineStore } from 'pinia'
import { ref } from 'vue'
import {ExtendedWeatherResponse} from '@/interface.ts'

export interface City {
  name: string
  weather: string,
  lat: number,
  lon: number,
  state: string,
  country: string,
  local_names: Record<string, string>
}

export interface CityStore {
  cities: City[]
  citiesWeather: ExtendedWeatherResponse[]
  setCity: (city: City) => void
  removeCity: (cityName: string) => void
  changeOrderCity: (oldCityName: string, newCityName: string) => void
  addAllCities: (cities: City[]) => void,
  isLoading: boolean,
  setLoading: (loadingState: boolean) => void
  setCitiesWeather: (citiesWeatherGot: ExtendedWeatherResponse[]) => void
}

export const useCityStore = defineStore('cityStore', () => {
  const cities = ref<City[]>([])
  const citiesWeather = ref<ExtendedWeatherResponse[]>([])
  const isLoading = ref<boolean>(false)

  function setCity(city: City): void {
    cities.value.push(city)
    localStorage.setItem('cities', JSON.stringify(cities.value))
  }

  function removeCity(cityName: string): void {
    const index = cities.value.findIndex((city) => city.name === cityName)
    if (index !== -1) {
      cities.value.splice(index, 1)
      localStorage.setItem('cities', JSON.stringify(cities.value))
    }
  }

  function changeOrderCity(oldCityName: string, newCityName: string): void {
    const oldCityIndex = cities.value.findIndex((city) => city.name === oldCityName)
    const newCityIndex = cities.value.findIndex((city) => city.name === newCityName)

    if (oldCityIndex === -1 || newCityIndex === -1) return

    const temp = cities.value[oldCityIndex]

    cities.value[oldCityIndex] = cities.value[newCityIndex]

    cities.value[newCityIndex] = temp

    localStorage.setItem('cities', JSON.stringify(cities.value))
  }

  function addAllCities(newCities: City[]): void {
    cities.value = [...newCities]
    localStorage.setItem('cities', JSON.stringify(cities.value))
  }

  function setLoading(loadingState: boolean): void {
    isLoading.value = loadingState
  }

  function setCitiesWeather(citiesWeatherGot: ExtendedWeatherResponse[]): void {
    citiesWeather.value = [...citiesWeatherGot]
  }

  return {
    cities,
    citiesWeather,
    isLoading,
    setCity,
    removeCity,
    changeOrderCity,
    addAllCities,
    setLoading,
    setCitiesWeather
  }
})
