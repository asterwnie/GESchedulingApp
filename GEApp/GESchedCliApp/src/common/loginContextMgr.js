//
// Manage the client-side caching of the user's email and access code.
//

import { centralStore } from '@/common/centralStore.js'

export const getCachedLoginContext = (loginContext) => {
    //debugger; // Uncomment to trigger breakpoint.
 
    var browserLocalStorage = window.localStorage;
    var loginContextInCookie = null;

    if (centralStore.state.appDefConfig.useCookieForLoginContext == false && 
        browserLocalStorage != null) {
        loginContextInCookie = browserLocalStorage.getItem(this.loginContextKey);
    } else {
        loginContextInCookie = this.getCookie(this.loginContextKey);
    }
    if (loginContextInCookie != null && loginContextInCookie != "") {
        var retrievedLoginContext = JSON.parse(loginContextInCookie);
        loginContext.requesterEmail = retrievedLoginContext.requesterEmail;
        loginContext.accessCode = retrievedLoginContext.accessCode;
    }
}


export const cacheLoginContext = (loginContext) => {
    //debugger; // Uncomment to trigger breakpoint.

    var browserLocalStorage = window.localStorage;
    var jsonString = JSON.stringify(loginContext);
    
    if (centralStore.state.appDefConfig.useCookieForLoginContext == false && 
        browserLocalStorage != null) {
        browserLocalStorage.setItem(this.loginContextKey, jsonString);
    } else {
        this.setCookie(this.loginContextKey, jsonString, 3650);
    }
    loginContext.accessCode = null; //Clear to avoid code stored in memory.
}


export const uncacheLoginContext = () => {

    var browserLocalStorage = window.localStorage;

    if (centralStore.state.appDefConfig.useCookieForLoginContext == false &&
        browserLocalStorage != null) {
        browserLocalStorage.removeItem(this.loginContextKey);
    } else {
        this.$cookie.delete(this.loginContextKey);
    }
}


export const setCookie  = (cname, cvalue, exdays) => {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}


export const getCookie = (cname) => {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}