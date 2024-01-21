<script lang="ts">
//Стили комопнентов не работают, только тайлвинд и main.scss

import {defineComponent, ref, onMounted, onBeforeMount, computed, watch} from 'vue'
import axios from 'axios'
import GearIcon from '@/icons/GearIcon.vue'
import '@/styles/main.scss'
// import SkeletonCityWeather from '@/components/SkeletonCityWeather.vue'
// import SkeletonCityWeather from '@/components/SkeletonCityWeather.vue'
import ItemCityWeather from '@/components/ItemCityWeather.vue'
import SettingsCityWeather from '@/components/SettingsCityWeather.vue'
import {API_KEY} from '@/constants.ts'
import {CityStore, useCityStore} from '@/stores/cityStore.ts'
import SkeletonCityWeather from '@/components/SkeletonCityWeather.vue'
import {ExtendedWeatherResponse, WeatherResponse} from '@/interface.ts'

export default defineComponent({
  components: {
    SkeletonCityWeather,
    GearIcon,
    ItemCityWeather,
    SettingsCityWeather,
    // SkeletonCityWeather
  },
  setup() {
    const latitude = ref<number>(0)
    const longitude = ref<number>(0)
    const city = ref<string>('')
    const isWeatherItemComponent = ref<boolean>(false)
    const cityStore: CityStore = useCityStore()
    // const cities: City[] = cityStore.cities
    const isLoading = computed(() => cityStore.isLoading)
    const cities = computed(() => cityStore.cities)
    const citiesWeather = computed(() => cityStore.citiesWeather)

    watch(cities, (newVal, oldVal) => {
      if (!oldVal.length) return

      getWeather()
    }, {
      deep: true
    })

    // Функция для получения города на основе координат
    const getCityName = async (lat: number, lon: number): Promise<void> => {
      // const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      const url = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
      // const url = `http://api.openweathermap.org/geo/1.0/direct?q=Тольятти&limit=1&appid=${API_KEY}`
      try {
        const response = await axios.get(url)
        if (!response?.data?.[0]) {
          console.error('City not found')
          return
        }

        console.error('city name', response.data[0].name)
        cityStore.setCity(response.data[0])
        city.value = response.data[0].name
      } catch (error) {
        console.error('Error fetching city:', error)
      }
    }

    const getWeatherCity = async (lat: number, lon: number, cityName: string): Promise<ExtendedWeatherResponse | null> => {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      // const url = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
      // const url = `http://api.openweathermap.org/geo/1.0/direct?q=Тольятти&limit=1&appid=${API_KEY}`
      try {
        const response = await axios.get<WeatherResponse>(url)
        if (!response.data) {
          console.error('WEATHER not found')
          return null
        }

        return {...response.data, name: cityName}
      } catch (error) {
        console.error('Error fetching city:', error)
        return null
      }
    }

    const getLocation = (): void => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          latitude.value = position.coords.latitude
          longitude.value = position.coords.longitude
          getCityName(+latitude.value, +longitude.value)
          // localStorage.setItem('qwerty', 'new')
        })
      } else {
        console.error('Geolocation is not supported by this browser.')
      }
    }

    onBeforeMount(() => {
      const defaultCity = localStorage.getItem('cities')
      cityStore.addAllCities(JSON.parse(defaultCity || '[]'))
    })

    onMounted(async () => {
      if (!cities.value.length) {
        askForGeolocationPermission()
      } else {
        getWeather()
      }
    })

    async function getWeather(): Promise<void> {
      try {
        cityStore.setLoading(true)
        const promiseArr: Promise<ExtendedWeatherResponse | null>[] = []
        cities.value.forEach((city) => {
          promiseArr.push(getWeatherCity(+city.lat, +city.lon, city.name))
        })
        const result = await Promise.all(promiseArr)
        if (!result) return

        const validResults = result.filter((weather): weather is ExtendedWeatherResponse => weather !== null)

        cityStore.setCitiesWeather(validResults)
        console.error('result', validResults)
      } catch (e) {
        console.error(e)
      } finally {
        cityStore.setLoading(false)
      }
    }
    function askForGeolocationPermission (): void {
      if ('geolocation' in navigator) {
        navigator.permissions.query({ name: 'geolocation' })
          .then(function(permissionStatus) {
            if (permissionStatus.state === 'granted') {
              console.error('Разрешение уже предоставлено, выполните код для определения местоположения')
              getLocation()
            } else if (permissionStatus.state === 'prompt') {
              // Запрашиваем разрешение у
              navigator.geolocation.getCurrentPosition(
                function(position) {
                  console.error('Разрешение уже предоставлено, выполните код для определения местоположения 2222')
                  getLocation()
                },
                function(error) {
                  // Разрешение отклонено или произошла ошибка
                  console.error('Ошибка при определении местоположения:', error)
                }
              )
            } else if (permissionStatus.state === 'denied') {
              // Разрешение отклонено
              console.warn('Доступ к местоположению отклонен пользователем.')
            }

            permissionStatus.onchange = function() {
              // Обработчик изменения разрешения
              console.log('Разрешение на определение местоположения изменилось:')
            }
          })
          .catch(function(error) {
            console.error('Ошибка при проверке разрешения:', error)
          })
      } else {
        console.warn('Геолокация не поддерживается в этом браузере.')
      }
    }

    const changeComponent = (): void => {
      // console.error('qwerty LOADISND', isLoading)
      isWeatherItemComponent.value = !isWeatherItemComponent.value
    }

    return {
      latitude,
      longitude,
      city,
      isWeatherItemComponent,
      citiesWeather,
      isLoading,
      changeComponent,
      cities
    }
  }
})
</script>


<template>
  <div class="widget-container flex justify-center">
    <div class="container border-box p-[20px] w-[400px] bg-gray-100">
      <div class="w-[100%] flex justify-end">
        <GearIcon
            class="gear"
            @click="changeComponent"
          />
      </div>
      <template v-if="!isWeatherItemComponent">
        <skeleton-city-weather v-if="isLoading" />
        <template v-if="citiesWeather.length">
          <item-city-weather
              v-for="city in citiesWeather"
              :key="city.name"
              :item="city"
            />
        </template>
      </template>
      <settings-city-weather v-else />
    </div>
  </div>
</template>
