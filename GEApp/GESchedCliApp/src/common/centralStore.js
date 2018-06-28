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

        currentRequest: null,       // To be assigned a new or exiting request for editing.

        currentUser: null,          // Will be assigned after successful login.

        roomSearchResult: [],       // Will be assigned when rooms are queried.

        currentUserRequests: [],    // Will be assigned when requests are queried.

        inAdminMode: false,

        // These reference data Will be assigned during login page startup
        appConfig: {},      
        notes: null,          
        hotels: null,         
        caterers: null, 
        rooms: [],

        requestPrompts: null,
        numOfRequestScreens: 0, // It will be inferred when the requestPrompts are retrieved.


        appDefConfig: {

            site: "HLS-MA",
            useCookieForLoginContext: false, // By default, use the browser's Local Storage instead.

            apiPort: null,      // 9090 only used during development
            apiHost: null,      // localhost only used during development
            apiAppPath: null,   // The option path name for the app. ex. meetingrequest is the app path if using http://localhost/meetingrequest

            loginUrlTmpl: 'http://{0}:{1}/api/users/login',

            usersUrlTmpl: 'http://{0}:{1}/api/users',

            appConfigUrlTmpl: 'http://{0}:{1}/api/appconfigs',

            notesUrlTmpl: 'http://{0}:{1}/api/notes',

            hotelsUrlTmpl: 'http://{0}:{1}/api/hotels',

            caterersUrlTmpl: 'http://{0}:{1}/api/caterers',

            roomsUrlTmpl: 'http://{0}:{1}/api/rooms',

            requestPromptsUrlTmpl: 'http://{0}:{1}/api/requestPrompts',

            requestsUrlTmpl: 'http://{0}:{1}/api/requests'

        }
  
    }
})

export const centralStore = store;