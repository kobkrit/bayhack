'use strict';

angular.module('bayhackApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('videoview', {
        url: '/videoview',
        templateUrl: 'app/videoview/videoview.html',
        controller: 'VideoviewCtrl'
      });
  });