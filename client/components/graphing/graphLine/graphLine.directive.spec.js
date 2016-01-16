'use strict';

describe('Directive: graphLine', function () {

  // load the directive's module and view
  beforeEach(module('proteoWebApp'));
  beforeEach(module('app/graphLine/graphLine.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<graph-line></graph-line>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the graphLine directive');
  }));
});
