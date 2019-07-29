// server.js
// where your node app starts

// init project
const fs = require('fs');
const path = require('path');
const nunjucks = require('nunjucks');
const express = require('express');
const fileUpload = require('express-fileupload');

const iChingHelper = require('iChingHelper');

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


// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
