<script lang="ts">
import {defineAsyncComponent, defineComponent, ref, PropType} from 'vue'
import {CityStore, useCityStore} from '@/stores/cityStore.ts'

import MenuIcon from '@/icons/MenuIcon.vue'
import TrashIcon from '@/icons/TrashIcon.vue'
export default defineComponent({
  components: {
    MenuIcon,
    TrashIcon
  },
  props: {
    city: {
      type: String as PropType<string>,
      required: true
    }
  },
  setup(props) {
    const isDragging = ref(false)
    const currentCity = props.city
    const cityStore: CityStore = useCityStore()

    const dragStart = (event: DragEvent) => {
      event?.dataTransfer.setData('item', currentCity)
      isDragging.value = true
    }

    const dragEnter = (event: DragEvent) => {
      if (!isDragging.value) {

      }
    }

    const dragLeave = (event: DragEvent) => {

    }

    const dragDrop = (event: DragEvent) => {
      event.preventDefault()
      const newCity = event.dataTransfer.getData('item')
      cityStore.changeOrderCity(currentCity, newCity)
      isDragging.value = false
    }

    const dragEnd = () => {
      isDragging.value = false
    }

    const removeItem = () => {
      cityStore.removeCity(currentCity)
    }

    return {
      isDragging,
      dragStart,
      dragEnter,
      dragLeave,
      dragDrop,
      dragEnd,
      removeItem
    }
  },
})
</script>


<template>
  <div
      class="w-[100%] h-[35px] flex items-center justify-between bg-gray-300 mt-[10px] box-border	px-[10px]"
      :draggable="isDragging"
      @dragstart="dragStart"
      @dragenter="dragEnter"
      @dragover.prevent
      @dragleave="dragLeave"
      @drop="dragDrop"
      @dragend="dragEnd"
    >
    <div class="flex gap-[8px] items-center">
      <div
          class="cursor-grab"
          @mousedown="isDragging = !isDragging"
        >
        <menu-icon />
      </div>
      <span class="city" :class="{ 'dragging': isDragging }">{{city}}</span>
    </div>
    <div
        class="cursor-pointer"
        @click="removeItem"
    >
      <trash-icon/>
    </div>
  </div>
</template>
