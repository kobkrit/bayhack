'use strict';

angular.module('bayhackApp')
  .controller('WatchCtrl', function ($scope, $http, socket, Auth, $location) {
    $scope.isTutor = Auth.isTutor();
    $scope.uploading = false;
    $scope.whiteboard = {info: ''};

    $http.get('/api/chats').success(function (chats) {
      $scope.chats = chats;
      socket.syncUpdates('chat', $scope.chats);
      scrollFn();
    });

    var whiteboardID = undefined;
    $http.get('/api/whiteboards').success(function (whiteboards) {
      whiteboardID = whiteboards[0]._id;
      $scope.whiteboard = whiteboards[0];
    });

    $("#whiteboard").keypress(function(e){
      $scope.$apply(function(){
        setTimeout(function(){
          $http.put('/api/whiteboards/' + whiteboardID, { name: 'Somebody', info: $scope.whiteboard.info});
        }, 100);
      });
    });

    socket.socket.on('whiteboard:save', function (item) {
      $scope.whiteboard = item;
    });

    var webrtc = new SimpleWebRTC({
      debug: false,
      // the id/element dom element that will hold "our" video
      localVideoEl: 'localVideo',
      // the id/element dom element that will hold remote videos
      remoteVideosEl: 'remoteVideos',
      // immediately ask for camera access
      autoRequestMedia: true
    });

    var videoRTC;
    var audioRTC;

    // we have to wait until it's ready
    webrtc.on('readyToCall', function () {
      // you can name it anything
      webrtc.joinRoom('testing');
      if ($scope.isTutor) {
        $scope.$apply(function () {
          $scope.status = "Start Recording...";
        });
        setTimeout(function () {
          var localMediaStream = webrtc.getLocalStream();
          videoRTC = RecordRTC(localMediaStream, { type: 'video' });
          videoRTC.startRecording();
          audioRTC = RecordRTC(localMediaStream, { type: 'audio' });
          audioRTC.startRecording();
          $scope.$apply(function () {
            $scope.status = "Recording...";
          });
        }, 100);
      }
    });

    $scope.$on('$destroy', function () {
//      if (!window.confirm("Are you sure you want to leave this page? Your record will be gone.")) {
//        event.preventDefault();
//      }else{
      socket.unsyncUpdates('chat');
      socket.unsyncUpdates('whiteboard');
//      }
    });

    // generating random string
    function generateRandomString() {
      if (window.crypto) {
        var a = window.crypto.getRandomValues(new Uint32Array(3)),
          token = '';
        for (var i = 0, l = a.length; i < l; i++) token += a[i].toString(36);
        return token;
      } else {
        return (Math.random() * new Date().getTime()).toString(36).replace(/\./g, '');
      }
    }

    // XHR2/FormData
    function xhr(url, data, callback) {
      var request = new XMLHttpRequest();
      request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
          callback(request.responseText);
        }
      };

      request.upload.onprogress = function (event) {
        progressBar.max = event.total;
        progressBar.value = event.loaded;
        progressBar.innerHTML = 'Upload Progress ' + Math.round(event.loaded / event.total * 100) + "%";
      };

      request.upload.onload = function () {
        percentage.style.display = 'none';
        progressBar.style.display = 'none';
      };
      request.open('POST', url);
      request.send(data);
    }

    function submitToServer(audio, video) {
      // getting unique identifier for the file name
      var fileName = generateRandomString();

      // this object is used to allow submitting multiple recorded blobs
      var files = { };
      // recorded audio blob
      files.audio = {
        name: fileName + '.' + audio.blob.type.split('/')[1],
        type: audio.blob.type,
        contents: audio.dataURL
      };

      files.video = {
        name: fileName + '.' + video.blob.type.split('/')[1],
        type: video.blob.type,
        contents: video.dataURL
      };

      $scope.uploading = true;
      $http.post('/upload', JSON.stringify(files)).success(function (uploads) {
        $scope.uploading = false;
        $location.path("/video/" + uploads);
      });
    }

    $scope.stopRecord = function () {
      videoRTC.stopRecording(function (videoURL) {
        audioRTC.stopRecording(function (audioURL) {
          console.log("videoURL:" + videoURL);
          console.log("audioURL:" + audioURL);
          webrtc.leaveRoom();

          audioRTC.getDataURL(function (audioDataURL) {
            var audio = {
              blob: audioRTC.getBlob(),
              dataURL: audioDataURL
            };
            videoRTC.getDataURL(function (videoDataURL) {
              var video = {
                blob: videoRTC.getBlob(),
                dataURL: videoDataURL
              };
              submitToServer(audio, video);
            });
          });

          $scope.$apply(function () {
            $scope.status = "Stopped!";
          });
        });
      });
    }
    var scrollFn = function () {
      setTimeout(function () {
        $("#chatbox").scrollTop($("#chatbox")[0].scrollHeight);
      }, 10);
    }

    $scope.$watch('chats.length', function (v) {
      scrollFn();
    });

    $scope.addChat = function () {
      if ($scope.newChat === '') {
        return;
      }
      $http.post('/api/chats', { who: 'Somebody', message: $scope.newChat });
      $scope.newChat = '';
      scrollFn();
    };
  });
