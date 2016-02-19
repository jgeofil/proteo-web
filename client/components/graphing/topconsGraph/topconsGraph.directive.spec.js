'use strict';

describe('Directive: topconsGraph', function () {

  // load the directive's module and view
  beforeEach(module('proteoWebApp'));
  beforeEach(module('components/graphing/topconsGraph/topconsGraph.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<topcons-graph></topcons-graph>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the topconsGraph directive');
  }));
});
