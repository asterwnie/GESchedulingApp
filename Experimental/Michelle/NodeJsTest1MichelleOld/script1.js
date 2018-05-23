var max = 10;

console.log('Hey, I can count!');
console.log("Hey, I can count!");
console.log('Hey, I can count ${max}');
console.log(`Hey, I can count ${max}`);

var i;
for (i = 0; i < max; i++) { 
    var num = i+1;
    console.log('Counting ' + num.toString());
    //console.log(`Counting ${num}`);
 } 

 console.log('Done counting!');

 
// Demo parsing string to an integer:
var str, num;

str = "10";
num = parseInt(str); 
console.log(`${str} returns: ${num}`);

str = "10.33";
num = parseInt(str);
console.log(`${str} returns: ${num}`);

str = "10.99";
num = parseInt(str);
console.log(`${str} returns: ${num}`);

str = "10.99";
num = parseFloat(str);
num = Math.round(num);
console.log(`${str} returns (after Math.round): ${num}`);

str = "34 45 66";
num = parseInt(str);
console.log(`${str} returns: ${num}`);

str = "7 Years";
num = parseInt(str);
console.log(`${str} returns: ${num}`);

str = "so will be 30 year old";
num = parseInt(str);
console.log(`${str} returns: ${num}`);

if (isNaN(num)) {
    console.log(`Yup, ${str} is NaN!`);
}

