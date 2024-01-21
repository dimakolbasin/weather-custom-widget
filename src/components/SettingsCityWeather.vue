<script lang="ts">
import {defineComponent, ref} from 'vue'
import {City, CityStore, useCityStore} from '@/stores/cityStore.ts'
import CityItem from '@/components/CityItem.vue'
import EnterIcon from '@/icons/EnterIcon.vue'
import axios from 'axios'
import {API_KEY} from '@/constants.ts'
export default defineComponent({
  components: {
    CityItem,
    EnterIcon
  },
  setup() {
    const cityInput = ref<string>('')
    const errorMessage = ref<string>('')
    const cityStore: CityStore = useCityStore()
    const cities = ref<City[]>(cityStore.cities)
    const sendCity = async (): Promise<void> => {
      if (!cityInput.value) return

      await getCityName(cityInput.value)
      // cityStore.setCity(cityInput.value)
      cityInput.value = ''
      console.error('sendCity', cityInput.value)
    }

    const getCityName = async (cityName: string): Promise<void> => {
      const url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`
      try {
        const response = await axios.get(url)
        if (!response.data?.length) {
          errorMessage.value = 'City not found'
          return
        }

        cityStore.setCity(response.data[0])
        if (errorMessage.value) errorMessage.value = ''
        console.error('city name get', response.data[0].name)
      } catch (error) {
        console.error('Error fetching city:', error)
      }
    }

    return {
      sendCity,
      cityInput,
      cities,
      errorMessage
    }
  },
})
</script>


<template>
  <div class="main-wrapper mt-[10px]">
    <div>Settings</div>
    <city-item
        v-for="city in cities"
        :key="city.name"
        :city="city.name"
      />
    <div class="mt-[30px] flex flex-col">
      <div>
        Add location:
      </div>
      <div class="flex items-center gap-[5px] mt-[5px]">
        <input
            type="text"
            placeholder="Add city"
            class="w-[100%] h-[35px] box-border"
            v-model="cityInput"
            @keyup.enter="sendCity"
          />
        <div
            class="cursor-pointer"
            @click="sendCity"
          >
          <enter-icon />
        </div>
      </div>
      <span
          v-if="errorMessage"
          class="mt-[10px]"
        >{{errorMessage}}
      </span>
    </div>
  </div>
</template>
