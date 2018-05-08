var fs = require('fs');
var path = require('path');

var filePath = path.join(__dirname, '/data/spaces.json');

fs.readFile(filePath, {encoding: 'utf-8'}, function(err, data) {
    if (!err) {
        console.log('Async Read - Data from file:\n' + data);
    } else {
        console.log(err);
    }
});
console.log("Done issuing async readFile.");

var jsonData = null;

try {
    jsonData = fs.readFileSync(filePath); // wait for file data to return.
    console.log('Sync Read - Data from file:\n' + jsonData);
} catch (err) {
    console.log('Sync Read got an error' + err);
}

console.log("Done issuing readFileSync.");

if (jsonData != null) {
    var json = JSON.parse(jsonData);

    // These won't properly display the json data.
    console.log(json);
    for (var item in json) {
        console.log(item);
        console.log(`Space Name: ${item.spaceName}`)
    }

    // Better way:
    json.forEach(function(item, index, array) {
	    console.log(`Space Name: ${item.spaceName}, Capacity: ${item.maxPersonsCapacity}`);
	});

} else {
    console.log('Unable to load json data!');
}

