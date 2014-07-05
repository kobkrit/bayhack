'use strict';

angular.module('bayhackApp')
  .controller('WatchCtrl', function ($scope, $http, socket) {
    $scope.message = 'Hello';

    $http.get('/api/chats').success(function (chats) {
      $scope.chats = chats;
      socket.syncUpdates('chat', $scope.chats);
      scrollFn();
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
    });

    $scope.$on('$destroy', function () {
      if (!window.confirm("Are you sure you want to leave this page? Your record will be gone.")) {
        event.preventDefault();
      }else{
        socket.unsyncUpdates('chat');
      }
    });

    $scope.stopRecord = function () {
      videoRTC.stopRecording(function (videoURL) {
        audioRTC.stopRecording(function (audioURL) {
          console.log("videoURL:" + videoURL);
          console.log("audioURL:" + audioURL);
          webrtc.leaveRoom();
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
