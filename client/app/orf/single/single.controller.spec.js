'use strict';

describe('Controller: OrfSingleCtrl', function () {

  // load the controller's module
  beforeEach(module('proteoWebApp'));

  var OrfSingleCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OrfSingleCtrl = $controller('OrfSingleCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
