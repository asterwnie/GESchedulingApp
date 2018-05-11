import Vue from 'vue'
import BootstrapVue from "bootstrap-vue"
import App from './App.vue'
import router from './router'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-vue/dist/bootstrap-vue.css"

Vue.use(BootstrapVue)

// See https://bootstrap-vue.js.org/docs/


new Vue({
  el: '#app',
  router,
  render: h => h(App)
})