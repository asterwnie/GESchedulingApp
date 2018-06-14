import Vue from 'vue';
import Vuex from 'vuex'; // Library for central data access and management.

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        currentViewTitle: "...",
        enableNavBar: false,

        loginContext: {
            requesterEmail: null,
            requesterName: null,
            accessCode: null
        },

        currentUser: null,  // Will be assigned during login

        appConfig: {},      // Will be assigned app start
        notes: {},          // Will be assigned app start
        hotels: {},         // Will be assigned app start
        caterers: {},       // Will be assigned app start

        appDefConfig: {

            site: "HLS-MA",
            useCookieForLoginContext: false, // By default, use the browser's Local Storage instead.

            apiPort: null,      // 9090 only used during development
            apiHost: null,      // localhost only used during development
            apiAppPath: null,   // The option path name for the app. ex. meetingrequest is the app path if using http://localhost/meetingrequest

            loginUrlTmpl: 'http://{0}:{1}/api/users/login',

            appConfigUrlTmpl: 'http://{0}:{1}/api/appconfigs',

            notesUrlTmpl: 'http://{0}:{1}/api/notes',

            hotelsUrlTmpl: 'http://{0}:{1}/api/hotels',

            roomsUrlTmpl: 'http://{0}:{1}/api/rooms',

            // These are use during  development. Be sure the turn all of them off.

            devModeIgnoreLoginFailure: false
        }
  
    }
})

export const centralStore = store;