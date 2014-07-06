'use strict';

angular.module('bayhackApp')
  .controller('VideoviewCtrl', function ($scope, $http, $stateParams) {
    $http.get('/api/videos/'+$stateParams.id).success(function (video) {
      $scope.video = video;
    })
  });
