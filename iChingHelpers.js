const fs = require('fs');
const path = require('path');
var stream = require('stream');


function readBytes(filePath) {
  var myStream = fs.createReadStream(filePath, {
    // objectMode: true,
    // highWaterMark: 1,
  }).pause().setEncoding('hex');
  
  console.log("Reading bytes");
  var output = "nooooo";
  var chonk = 0;
  
  while (myStream.readable) {
    var chunk = myStream.read();
    console.log(chonk)
    // console.log(chunk);
    chonk ++;
  }
  
  console.log("outer", output);
  return output;
}

readBytes("./public/uploads/Text File.txt");
