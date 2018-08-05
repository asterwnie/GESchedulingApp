//
// REST API creation helper
//

import { centralStore } from '@/common/centralStore.js'


export const prepareApiServerUrlSettings = () => {
    //debugger; // Uncomment to trigger breakpoint. 

    const parser = document.createElement('a');
    parser.href = document.URL;

    var defConfig = centralStore.state.appDefConfig;
    defConfig.apiHost = parser.hostname;

    if (parser.pathname != null && parser.pathname != "") {
        var pathname = parser.pathname.replace('/', '');
        if (pathname != "") {
            defConfig.apiAppPath = pathname;
        }
    }

    if (parser.port == '8080') { 
        // Port 8080 denote debug environment so assume the API server is at port 9090.
        // defConfig.apiPort = '9090';
        defConfig.apiPort = '80'; //NOTE: As of 8/4/18, in debug environment, it's also using port 80.
    } else {
        // In production mode the client we UI will from the same web API server app. 
        defConfig.apiPort = parser.port;
    }
}


export const getLoginUrl = () => {
    //debugger; // Uncomment to trigger breakpoint.

    const appDefConfig = centralStore.state.appDefConfig;
    var url = appDefConfig.loginUrlTmpl.replace('{0}', appDefConfig.apiHost);
    url = url.replace('{1}', appDefConfig.apiPort);
    url = url + "?site=" + appDefConfig.site;
    return url;
}


export const getAppConfigUrl = () => {
    //debugger; // Uncomment to trigger breakpoint.

    const appDefConfig = centralStore.state.appDefConfig;
    var url = appDefConfig.appConfigUrlTmpl.replace('{0}', appDefConfig.apiHost);
    url = url.replace('{1}', appDefConfig.apiPort);
    url = url + "?site=" + appDefConfig.site;
    return url;
}


export const getNotesUrl = () => {
    //debugger; // Uncomment to trigger breakpoint.

    const appDefConfig = centralStore.state.appDefConfig;
    var url = appDefConfig.notesUrlTmpl.replace('{0}', appDefConfig.apiHost);
    url = url.replace('{1}', appDefConfig.apiPort);
    url = url + "?site=" + appDefConfig.site;
    return url;
}

export const getHotelsUrl = () => {
    //debugger; // Uncomment to trigger breakpoint.

    const appDefConfig = centralStore.state.appDefConfig;
    var url = appDefConfig.hotelsUrlTmpl.replace('{0}', appDefConfig.apiHost);
    url = url.replace('{1}', appDefConfig.apiPort);
    url = url + "?site=" + appDefConfig.site;
    return url;
}

export const getCaterersUrl = () => {
    //debugger; // Uncomment to trigger breakpoint.

    const appDefConfig = centralStore.state.appDefConfig;
    var url = appDefConfig.caterersUrlTmpl.replace('{0}', appDefConfig.apiHost);
    url = url.replace('{1}', appDefConfig.apiPort);
    url = url + "?site=" + appDefConfig.site;
    return url;
}


export const getRoomsUrl = () => {
    //debugger; // Uncomment to trigger breakpoint.

    const appDefConfig = centralStore.state.appDefConfig;
    var url = appDefConfig.roomsUrlTmpl.replace('{0}', appDefConfig.apiHost);
    url = url.replace('{1}', appDefConfig.apiPort);
    url = url + "?site=" + appDefConfig.site;
    return url;
}

export const getRequestPromptsUrl = () => {
    //debugger; // Uncomment to trigger breakpoint.

    const appDefConfig = centralStore.state.appDefConfig;
    var url = appDefConfig.requestPromptsUrlTmpl.replace('{0}', appDefConfig.apiHost);
    url = url.replace('{1}', appDefConfig.apiPort);
    url = url + "?site=" + appDefConfig.site;
    return url;
}

export const getRequestsUrl = () => {
    //debugger; // Uncomment to trigger breakpoint.

    const appDefConfig = centralStore.state.appDefConfig;
    var url = appDefConfig.requestsUrlTmpl.replace('{0}', appDefConfig.apiHost);
    url = url.replace('{1}', appDefConfig.apiPort);
    url = url + "?site=" + appDefConfig.site;
    return url;
}
export const getRequestByIdUrl = (id) => {
    //debugger; // Uncomment to trigger breakpoint.

    const appDefConfig = centralStore.state.appDefConfig;
    var url = appDefConfig.requestsUrlTmpl.replace('{0}', appDefConfig.apiHost);
    url = url.replace('{1}', appDefConfig.apiPort);
    url = url + `/${id}?site=` + appDefConfig.site;
    return url;
}

export const getUsersUrl = () => {
    //debugger; // Uncomment to trigger breakpoint.

    const appDefConfig = centralStore.state.appDefConfig;
    var url = appDefConfig.usersUrlTmpl.replace('{0}', appDefConfig.apiHost);
    url = url.replace('{1}', appDefConfig.apiPort);
    url = url + "?site=" + appDefConfig.site;
    return url;
}

export const getAccessCodesUrl = () => {
    //debugger; // Uncomment to trigger breakpoint.

    const appDefConfig = centralStore.state.appDefConfig;
    var url = appDefConfig.accessCodesUrlTmpl.replace('{0}', appDefConfig.apiHost);
    url = url.replace('{1}', appDefConfig.apiPort);
    url = url + "?site=" + appDefConfig.site;
    return url;
}