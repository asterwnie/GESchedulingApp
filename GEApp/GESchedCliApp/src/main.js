// This JavaScript is the client-side application's starting script.
// It's reference in the webpack.config.js as Entry point.
// This script generates html contents for the index.html page at run-time.

'use strict' // Reason: https://www.w3schools.com/js/js_strict.asp

import Vue from 'vue'
var VueCookie = require('vue-cookie');
// Tell Vue to use the plugin
Vue.use(VueCookie);

import router from './router' // The client-side routes are defined in the index.js file under the client-src/router folder.
import App from './App.vue'   // The main view for this SPA.
import { centralStore } from './store/centralStore.js'


// This main view will create an App view and injects the App view's html 
// into the div element with the id of 'app' in the index.html page.
new Vue({
  el: '#app',
  store: centralStore,
  router,
  render: h => h(App)
})

