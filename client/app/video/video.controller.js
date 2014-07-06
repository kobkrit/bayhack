'use strict';

angular.module('bayhackApp')
  .controller('VideoCtrl', function ($scope, $http, $stateParams, Auth, $location) {
    $scope.i = {price:0.2};
    $scope.filePath = $stateParams.file;
    $scope.filePathFull = '/files/' + $stateParams.file;
    $scope.who = Auth.getCurrentUser();

    $scope.addVideo = function () {
      $http.post('/api/videos', { uploadBy: $scope.who.name, price: $scope.i.price, file: $scope.filePathFull, name: $scope.i.name, info:  $scope.i.info}).success(function(){
        $location.path("/videolist");
      });
    };
  });
