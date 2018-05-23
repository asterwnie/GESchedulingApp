const express = require('express'); // info: simplifies web app programming. 

var portNum = 900; // The port 80 is already used for web browsing on your machine, pick another unique/unused port.

var app = express();
var appName = "Web Server2";


// Setup Routes:
// To test on you local machine, issue these:
// http://localhost:900
// http://localhost:900/about  Note: routes are not case sensitive

app.get('/', function (req, res) {
    var now = new Date();  
    var msg = "Home - Hello World from " + appName + " [" + now.toLocaleTimeString() + "]";
    console.log("Responding with: " + msg);
    res.send(msg);
})

app.get('/About', function (req, res) {
    var now = new Date();  
    var msg = "About Us - [" + now.toLocaleTimeString() + "]";
     console.log("Responding with: %s",  msg);
    res.send(msg);  
})


var server = app.listen(portNum, function () {
    var port = server.address().port
    console.log("%s listening on port %s", appName, port)
})