//
// Manage the client-side caching of the user's email and access code.
//

import { centralStore } from '@/common/centralStore.js'

export const getCachedItem = (key) => {
    //debugger; // Uncomment to trigger breakpoint.
 
    let browserLocalStorage = window.localStorage;
    var loginContextInLocal = null;
    var cachedItem = null;

    try {
        if (centralStore.state.appDefConfig.useCookieForLoginContext == false && browserLocalStorage != null) {
            loginContextInLocal = browserLocalStorage.getItem(key);
        } else {
            loginContextInLocal = getCookie(key);
        }
        if (loginContextInLocal != null && loginContextInLocal != "") {
            cachedItem = JSON.parse(loginContextInLocal);
        }
    } catch (err) {}

    if (cachedItem == "") {
        cachedItem = null;
    }
    return cachedItem;
}


export const cacheItem = (key, item) => {
    //debugger; // Uncomment to trigger breakpoint.

    var browserLocalStorage = window.localStorage;
    var jsonString = JSON.stringify(item);
    
    if (centralStore.state.appDefConfig.useCookieForLoginContext == false && browserLocalStorage != null) {
        browserLocalStorage.setItem(key, jsonString);
    } else {
        setCookie(key, jsonString, 3650);
    }
}


export const uncacheItem = (key) => {

    var browserLocalStorage = window.localStorage;

    if (centralStore.state.appDefConfig.useCookieForLoginContext == false && browserLocalStorage != null) {
        browserLocalStorage.removeItem(key);
    } else {
        setCookie(key, "", 0);
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