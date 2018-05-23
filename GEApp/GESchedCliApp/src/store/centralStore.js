import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const centralStore = new Vuex.Store({
    state: {
        currentViewTitle: "...",
        requesterEmail: "",
        loginUrl: "http://localhost:9090/api/users/login?site=HLS-MA" //To-Do: Need to add site code to cookie
    }
})