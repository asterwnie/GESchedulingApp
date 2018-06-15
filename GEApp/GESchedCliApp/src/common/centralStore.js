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

        currentUser: null,  // Will be assigned after successful login


        // These reference data Will be assigned during login page startup
        appConfig: {},      
        notes: null,          
        hotels: null,         
        caterers: null,       
        requestPrompts: null,


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

            requestPromptsUrlTmpl: 'http://{0}:{1}/api/requestPrompts',

            // These are use during  development. Be sure the turn all of them off.

            devModeIgnoreLoginFailure: false
        }
  
    }
})

export const centralStore = store;