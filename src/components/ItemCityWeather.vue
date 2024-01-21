<script lang="ts">
import {defineComponent, onMounted, PropType, toRefs} from 'vue';
import WeatherIcon from '@/icons/WeatherIcon.vue';
import {ExtendedWeatherResponse} from "@/interface.ts";
export default defineComponent({
  components: {
    WeatherIcon,
  },
  props: {
    item: {
      type: Object as PropType<ExtendedWeatherResponse>,
      required: false,
      default: () => ({}),
    },
  },
  setup(props) {

    return {};
  },
});
</script>

<template>
  <div class="flex flex-col justify-center mt-[10px] mb-[30px]">
    <div>
      {{ item.name || 'London, UK' }}
    </div>
    <div class="flex w-[100%] justify-center mt-[15px]">
      <div class="flex gap-[8px]">
        <div class="w-[80px] h-[80px]">
          <weather-icon class="mt-[3px]" />
        </div>
        <div class="text-[48px] w-[80px] h-[80px] flex items-center">
          {{ `${Math.round(item.main.temp - 273.15) < 0 ? Math.round(item.main.temp - 273.15) : '+' + Math.round(item.main.temp - 273.15)}°C` }}
        </div>
      </div>
    </div>
  </div>
</template>
