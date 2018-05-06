var http = require('http');
var port = 900;

//http.createServer(ReqResHandlerV1).listen(port);
//http.createServer(ReqResHandlerV2).listen(port);
http.createServer(JustCallHandlerV2).listen(port);

function ReqResHandlerV1 (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World!! (from version 1)');
}


function ReqResHandlerV2 (req, res) {
    if (req.url === "/") //root; usually home
    {
        res.writeHead(200, {'Content-Type': 'text/plain'}); //this page breaks because the content type is plain!
        res.end('<b>Hello World!</b> (from version 2)');

    } else if (req.url === "/about") {

        res.writeHead(200, {'Content-Type': 'text/html'}); //much better! this content-type is declared as html.
        res.end('<b>All about that bass!</b> (from version 2)');
    }
}

function JustCallHandlerV2(req, res) {
    console.log('About to call ReqResHandlerV2');
    ReqResHandlerV2 (req, res);
}


console.log(`Server1 started on port ${port}`);