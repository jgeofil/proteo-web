'use strict';

describe('Controller: OrfComparisonCtrl', function () {

  // load the controller's module
  beforeEach(module('proteoWebApp'));

  var OrfComparisonCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OrfComparisonCtrl = $controller('OrfComparisonCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
