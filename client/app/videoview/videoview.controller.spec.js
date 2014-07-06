'use strict';

describe('Controller: VideoviewCtrl', function () {

  // load the controller's module
  beforeEach(module('bayhackApp'));

  var VideoviewCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    VideoviewCtrl = $controller('VideoviewCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
