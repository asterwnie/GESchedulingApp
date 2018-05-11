var mongoose = require('mongoose'); // from: npm install mongoose --save

mongoose.Promise = global.Promise;
var dbUrl = 'mongodb://localhost:27017/MyFirstMongoDB';

mongoose.connect(dbUrl)
    .then(function () {
        console.log('connection succesful');
    })
    .catch((err) => console.error(err));


var HotelSchema = mongoose.Schema({
    name: String,
    price: Number
});

// Create a model that can be used like a Java Class to create instances.
var Hotel = mongoose.model('Hotel', HotelSchema);


//Create a random number between 1 and 50:
var num = Math.floor((Math.random() * 50) + 1);
var cost = 13 * num;
var newHotel = new Hotel({ name: `Hotel ${num} Inn`, price: cost });

newHotel.save(function (err) {
    if (err) {
        return handleError(err);
    }
    console.log("");
    console.log(`Saved:\n${newHotel}`);
});


Hotel.find(function (err, hotels) {
    if (err) return next(err);
        //To-Do: use hotels
        console.log("");
        console.log(`All hotels retrieved:\n${hotels}`);
});


Hotel.findOne({ name: /(Inn)/ }).then( hotel => {
    var item = hotel;
});


Hotel.find({ name: /(Inn)/ }, function (err, hotels) {
    if (err) return next(err);
    //To-Do: use hotels
    console.log("");
    console.log(`Inns retrieved:\n${hotels}`);
});

Hotel.
  find({  name: /(Inn)/ }).
  where('price').gt(10).lt(120).
  sort('-name').
  select('name price').
  exec(function (err, hotels) {
    if (err) return handleError(err);
        console.log("More advance find:");
        console.log(`Inns retrieved:\n${hotels}`);
  });



// Learn more: http://mongoosejs.com/docs/queries.html

  