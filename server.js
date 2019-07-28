// server.js
// where your node app starts

// init project
const fs = require('fs');
const path = require('path');
const nunjucks = require('nunjucks');
const express = require('express');
const fileUpload = require('express-fileupload');

var stream = require('stream');
var Busboy = require('busboy');

const app = express();

var iChing = require('i-ching');

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

app.use(express.static('public'));

nunjucks.configure('views', {
    autoescape: true,
    noCache: true,
    express: app
});

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
// app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  var title = "I Ching Passwords "
  var hexagram = iChing.hexagram(getRandomInt(64));
  console.log(hexagram);
  response.render('index.html', { hex: hexagram });
});

app.get('/background', function(req, res) {
  res.render('background.html');
});

app.get('/upload', function(request, response) {
  var title = "Upload a file to get its I Ching value "
  response.render('upload.html', {bytes: readBytes("/app/public/uploads/Text File.txt")});
});


app.post('/upload', function(req, res) {
    var busboy = new Busboy({ headers: req.headers });
    var saveTo = "";
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      saveTo = path.join('./public/uploads', filename);
      console.log('Uploading to: ' + saveTo);
      // debugger;
      file.pipe(fs.createWriteStream(saveTo));
    });
    busboy.on('finish', function() {
      console.log('Upload complete');
      readBytes(saveTo);
      res.writeHead(200, { 'Connection': 'close' });
      res.end("That's all folks!");
    });
    return req.pipe(busboy);
});

function readBytes(filePath) {
  var myStream = fs.createReadStream(filePath, {
    // objectMode: true,
    // highWaterMark: 1,
  }).pause().setEncoding('hex');;
  
  console.log("Reading bytes");
  var output = "nooooo";
  var chonk = 0;
  
  while (myStream.readable) {
    var chunk = myStream.read();
    console.log(chonk)
    console.log(chunk);
    chonk ++;
  }
  
  // myStream.on("data", function(data) {
  //     var chunk = data.toString();
  //     // output = `Received ${chunk.length} bytes of data.`
  //     output = "supppp";
  //     console.log(output);
  //     // if (chunk.length > 0) {
  //     //     output = chunk;
  //     // }
  //     console.log(chunk);
  // });
  console.log("outer", output);
  return output;
}

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
