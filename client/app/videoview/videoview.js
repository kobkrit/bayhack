'use strict';

angular.module('bayhackApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('videoview', {
        url: '/videoview/:id',
        templateUrl: 'app/videoview/videoview.html',
        controller: 'VideoviewCtrl'
      });
  });