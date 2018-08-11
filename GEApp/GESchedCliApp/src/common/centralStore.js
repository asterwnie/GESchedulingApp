import Vue from 'vue';
import Vuex from 'vuex'; // Library for central data access and management.

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {

        currentViewTitle: "...",
        enableNavBar: false,
        hideBackNav: false,
        previousPage: null,

        defaultTimeOption: "09:00:00",
        maxSeatingCapacityInputVal: 500,

        isInSmallWidthMode: false,
        smallWidthModeMax: 768,

        isModalBeingDisplayed: false,
        
        selectedRoom: null,

        processingStatusOptions: null,

        loginContext: {
            requesterEmail: null,
            accessCode: null
        },

        currentUser: null,
        currentAdminUser: null,
        inAdminMode: false,

        currentSendEmailRecipientEmail: null,
        currentSendEmailRecipientName: null,

        currentRequest: null,
        currentUserRequests: [],
        currentRequestsPreview: [],

        roomSearchResult: [],

        // These reference data Will be assigned during login page startup
        appConfig: {},      
        notes: null,          
        rooms: [],
        requestPrompts: null,

        hotels: null,         
        caterers: null, 

        numOfRequestScreens: 0, // It will be inferred when the requestPrompts are retrieved.

        defRecipientNameForSendEmail: null,
        defRecipientEmailForSendEmail: null,

        mostRecentUserAccessCode: null,
        mostRecentAdminAccessCode: null,

        
        actionForSelectedRequest: {

            forDelete: null,
            forDeleteFromView: null,
            forDeleteDlgTitle: "Delete Request",
            forDeleteDlgMsg: "Are you sure you want to delete this request? This action cannot be undone.",
            forDeleteConfirmBtnLabel: "Confirm Delete",
            forDeleteDismissBtnLabel: "Cancel",

            forCancel: null,
            forCancelFromView: null,
            forCancelDlgTitle: "Cancel Request",
            forCancelDlgMsg: "Are you sure you want to cancel this meeting request? This action cannot be undone.",
            forCancelConfirmBtnLabel: "Confirm Cancel",
            forCancelDismissBtnLabel: "Don't Cancel"
        },



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

            requestsUrlTmpl: 'http://{0}:{1}/api/requests',

            accessCodesUrlTmpl: 'http://{0}:{1}/api/accessCodes'

        }
    }
})

export const centralStore = store;