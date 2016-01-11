'use strict';

describe('Controller: ProjCtrl', function () {

  // load the controller's module
  beforeEach(module('proteoWebApp'));

  var ProjCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProjCtrl = $controller('ProjCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
