var fs = require('fs'); //importing
var path = require('path'); //importing

//How to load up data from a file

var filePath = path.join(__dirname, '/data/spaces.json'); //two underscores mean internal variable

fs.readFile(filePath, {encoding: 'utf-8'}, function(err, data) { //encoding refers to size per character (encoding utf-8 means english); brackets typically mean json parameter
    //this is an asynchronous function; the rest of the code will continue to run.
    //beware writing to the same file at the same time!
    if (!err) {
        console.log('Async Read - Data from file:\n' + data);
    } else {
        console.log(err);
    }
});
console.log("Done issuing async readFile.");

var jsonData = null;

try {
    jsonData = fs.readFileSync(filePath); // wait for file data to return. FORCING a block in the code so it does not continue. use if you need this to finish before you continue.
    console.log('Sync Read - Data from file:\n' + jsonData);
} catch (err) {
    console.log('Sync Read got an error' + err);
}

console.log("Done issuing readFileSync.");

if (jsonData != null) {
    var json = JSON.parse(jsonData);

    // These won't properly display the json data.
    console.log(json);
    for (var item in json) { //normal for each loop
        console.log(item);
        console.log(`Space Name: ${item.spaceName}`)
    }

    // Better way:
    json.forEach(function(item, index, array) { //smart json forEach
	    console.log(`Space Name: ${item.spaceName}, Capacity: ${item.maxPersonsCapacity}`);
	});

} else {
    console.log('Unable to load json data!');
}

