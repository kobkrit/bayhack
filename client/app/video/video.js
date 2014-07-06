'use strict';

angular.module('bayhackApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('video', {
        url: '/video/:file',
        templateUrl: 'app/video/video.html',
        controller: 'VideoCtrl'
      });
  });