var appConfig = {};

//these declare and set these property variables
appConfig.devMode = true;

appConfig.appServerName = 'GEMeetingRequestWebApp';
appConfig.port = 9090;
appConfig.noPageCaching = true;

appConfig.dbUrlRefix = 'mongodb://localhost:27017/GEMeetingRequestDB';

appConfig.defaultSite = 'HLS-MA';
appConfig.sites = [
    { site: 'HLS-MA', description:'', address: ''}, 
    { site: 'SITE-2', description:'', address: ''}];

module.exports = appConfig;