var appConfig = {}; // Start as a blank object and attach dynamic properties (see assignments below).

appConfig.devMode = true;

appConfig.appServerName = 'GEMeetingRequestApiApp';
appConfig.port = 9090;
appConfig.noPageCaching = true;

appConfig.dbUrlRefix = 'mongodb://localhost:27017/GEMeetingRequestDB';

appConfig.defaultSite = 'HLS-MA';
appConfig.sites = [
    { site: 'HLS-MA', description:'GE Healthcare Life Science', address: '100 Results Way, Marlborough, MA 01752'}, 
    { site: 'SITE-2', description:'Test Site 2', address: '100 Main Street, Sometown, MA 10011'}];


//appConfig.distinctRoomConfigurations = [];
//appConfig.distinctRoomCapabilities = [];
//appConfig.distinctRoomSizeTypes = [];


module.exports = appConfig;