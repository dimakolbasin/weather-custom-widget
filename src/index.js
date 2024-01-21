import { createApp } from 'vue'
import App from './App.vue'

import './styles/main.scss'
import { VueQueryPlugin } from 'vue-query'


import { createPinia } from 'pinia'


import { defineCustomElement } from 'vue'

// App.styles = deepStylesOf(App)
//
// function deepStylesOf({ styles = [], components = {} }) {
//   return [...styles, ...Object.values(components).flatMap(deepStylesOf)]
// }


const app = createApp(App)
const store = createPinia()
app.use(VueQueryPlugin)

app.use(store)
//
// const ExampleElement = defineCustomElement(App)
//
// customElements.define('weather-widget', ExampleElement)

app.mount('#app')
