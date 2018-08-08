var appConfig = {}; // Start as a blank object and attach dynamic properties (see assignments below).

appConfig.devMode = true;

appConfig.appServerName = 'GEMeetingRequestApiApp';
//appConfig.port = 9090; //Previously used for local development
appConfig.port = 80;
appConfig.noPageCaching = true;

// If database is held on a different server, then this location can be changed.
appConfig.dbUrlRefix = 'mongodb://localhost:27017/GEMeetingRequestDB';

appConfig.defaultSite = 'HLS-MA';

// The following are possible data for future use to select a different site by the user.
// This app can store partitioned data for multiple sites.
appConfig.sites = [
    { site: 'HLS-MA', description:'GE Healthcare Life Science', address: '100 Results Way, Marlborough, MA 01752'}, 
    { site: 'SITE-2', description:'Test Site 2', address: '100 Main Street, Sometown, MA 10011'}];

module.exports = appConfig;