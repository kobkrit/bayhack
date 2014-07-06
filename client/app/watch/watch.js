'use strict';

angular.module('bayhackApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('watch', {
        url: '/watch',
        templateUrl: 'app/watch/watch.html',
        controller: 'WatchCtrl',
        authenticate: true
      });
  });