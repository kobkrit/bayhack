/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var fs = require('fs');

function _upload(response, file) {
  var fileRootName = file.name.split('.').shift(),
    fileExtension = file.name.split('.').pop(),
    filePathBase = __dirname +'/uploads/',
    fileRootNameWithBase = filePathBase + fileRootName,
    filePath = fileRootNameWithBase + '.' + fileExtension,
    fileID = 2,
    fileBuffer;

  while (fs.existsSync(filePath)) {
    filePath = fileRootNameWithBase + '(' + fileID + ').' + fileExtension;
    fileID += 1;
  }

  file.contents = file.contents.split(',').pop();

  fileBuffer = new Buffer(file.contents, "base64");

  fs.writeFileSync(filePath, fileBuffer);
}

function ifMac(response, files) {
  // its probably *nix, assume ffmpeg is available
  var audioFile = __dirname + '/uploads/' + files.audio.name;
  var videoFile = __dirname + '/uploads/' + files.video.name;
  var mergedFile = __dirname + '/uploads/' + files.audio.name.split('.')[0] + '-merged.webm';

  var util = require('util'),
    exec = require('child_process').exec;

  var command = "ffmpeg -i " + audioFile + " -i " + videoFile + " -map 0:0 -map 1:0 " + mergedFile;

  exec(command, function (error, stdout, stderr) {
    if (stdout) console.log(stdout);
    if (stderr) console.log(stderr);

    if (error) {
      console.log('exec error: ' + error);
      response.statusCode = 404;
      response.end();

    } else {
      response.statusCode = 200;
      response.writeHead(200, {
        'Content-Type': 'application/json'
      });
      response.end(files.audio.name.split('.')[0] + '-merged.webm');

      // removing audio/video files
      fs.unlink(audioFile);
      fs.unlink(videoFile);
    }

  });
}

module.exports = function(app) {
  // Insert routes below
  app.use('/api/videos', require('./api/video'));
  app.use('/api/chats', require('./api/chat'));
  app.use('/api/things', require('./api/thing'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth'));

  //Nattaphong zone
  app.get('/pay', function(req,res,next){
    //req.body
    var BitPay  = require('bitpay');
    res.end("ok");
  });

  app.post('/upload', function(req,res,next){;
    _upload(res, req.body.audio);
    _upload(res, req.body.video);
    ifMac(res, req.body);
  });

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });
};
