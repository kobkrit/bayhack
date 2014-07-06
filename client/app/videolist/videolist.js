'use strict';

angular.module('bayhackApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('videolist', {
        url: '/videolist',
        templateUrl: 'app/videolist/videolist.html',
        controller: 'VideolistCtrl'
      });
  });