'use strict';

angular.module('bayhackApp')
  .controller('WatchCtrl', function ($scope, $http, socket) {
    $scope.message = 'Hello';

    $http.get('/api/chats').success(function(chats) {
      $scope.chats = chats;
      socket.syncUpdates('chat', $scope.chats);
      scrollFn();
    });

    var webrtc = new SimpleWebRTC({
      // the id/element dom element that will hold "our" video
      localVideoEl: 'localVideo',
      // the id/element dom element that will hold remote videos
      remoteVideosEl: 'remoteVideos',
      // immediately ask for camera access
      autoRequestMedia: true
    });

    // we have to wait until it's ready
    webrtc.on('readyToCall', function () {
      // you can name it anything
      webrtc.joinRoom('testing');
    });

//    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
//
//    var constraints = {video: true, audio: true};
//
//    function successCallback(stream) {
//      var video = document.querySelector("video");
//      video.src = window.URL.createObjectURL(stream);
//      video.play();
//    }
//
//    function errorCallback(error) {
//      console.log("navigator.getUserMedia error: ", error);
//    }
//
//    navigator.getUserMedia(constraints, successCallback, errorCallback);

    var scrollFn = function(){
      setTimeout(function(){
        $("#chatbox").scrollTop($("#chatbox")[0].scrollHeight);
      },10);
    }

    $scope.$watch('chats.length', function(v){
      scrollFn();
    });

    $scope.addChat = function() {
      if($scope.newChat === '') {
        return;
      }
      $http.post('/api/chats', { who:'Somebody', message:$scope.newChat });
      $scope.newChat = '';
      scrollFn();
    };
  });
