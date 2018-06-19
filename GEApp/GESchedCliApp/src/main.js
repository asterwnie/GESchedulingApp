// This JavaScript is the client-side application's starting script.
// It's reference in the webpack.config.js as Entry point.
// This script generates html contents for the index.html page at run-time.

'use strict' // Reason: https://www.w3schools.com/js/js_strict.asp

import Vue from 'vue'
import router from './router' // The client-side routes are defined in the index.js file under the client-src/router folder.
import Promise from 'promise-polyfill'

import App from './App.vue'   // The main view for this SPA.
import { centralStore } from '@/common/centralStore.js'
import { prepareApiServerUrlSettings } from '@/common/apiMgr.js';


// debugger;
if (!window.Promise) { 
  window.Promise = Promise 
}

prepareApiServerUrlSettings();

// This main view will create an App view and injects the App view's html 
// into the div element with the id of 'app' in the index.html page.
var appView = new Vue({
  el: '#app',
  store: centralStore,
  router,
  render: h => h(App)
})

