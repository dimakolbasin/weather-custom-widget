<script>
import { ContentLoader } from 'vue-content-loader'

export default {
  components: {
    ContentLoader
  }
}
</script>

<template>
  <content-loader
      viewBox="0 0 400 300"
      :speed="2"
      primaryColor="#e1d1d1"
      secondaryColor="#ecebeb"
    >
    <rect
        x="-1"
        y="16"
        rx="2"
        ry="2"
        width="154"
        height="22"
      />
    <rect
        x="-7"
        y="210"
        rx="0"
        ry="0"
        width="410"
        height="88"
      />
    <rect
        x="-4"
        y="153"
        rx="0"
        ry="0"
        width="403"
        height="39"
      />
    <rect
        x="87"
        y="60"
        rx="0"
        ry="0"
        width="101"
        height="72"
      />
    <rect
        x="210"
        y="60"
        rx="0"
        ry="0"
        width="101"
        height="72"
      />
  </content-loader>
</template>
