var http = require('http');
var port = 900; // The port 80 is already used for web browsing on your machine, pick another unique/unused port.

// To test on you local machine, issue these:
// http://localhost:900
// http://localhost:900/about  Note: routes are not case sensitive


http.createServer(ReqResHandlerV1).listen(port);
//http.createServer(ReqResHandlerV2).listen(port);

// In this version the request's url is not looked at 
// so all request gets back the same response.
function ReqResHandlerV1 (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World!! (from version 1)');
}

// THis version examines the url to see where to route the request for processing.
// Doing if.. else if.. else if.. gets messy when there are many routes to deal with.
// In server2.js we will simpify this using the Express library.
function ReqResHandlerV2 (req, res) {
    if (req.url === "/")
    {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('<b>Hello World!</b> (from version 2)');

    } else if (req.url === "/about") {

        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end('<b>All about that bass!</b> (from version 2)');
    } else if (req.url === "/about") {

        res.writeHead(200, {'Content-Type': 'text/html'}); // display it as a html
        res.end('<b>All about that bass!</b> (from version 2)'); //that is the html
    }
}


console.log(`Server1 started on port ${port}`);