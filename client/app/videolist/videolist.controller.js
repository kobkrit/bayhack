'use strict';

angular.module('bayhackApp')
  .controller('VideolistCtrl', function ($scope, $http) {
    $http.get('/api/videos').success(function (videos) {
      $scope.videos = videos;
      setTimeout(function(){
        $("video").each(function(){
          this.currentTime = 2;
        })
      },100)
    });
  });
