'use strict';

describe('Controller: OrfCtrl', function () {

  // load the controller's module
  beforeEach(module('proteoWebApp'));

  var OrfCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OrfCtrl = $controller('OrfCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
