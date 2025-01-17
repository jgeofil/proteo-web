'use strict';

describe('Directive: itasserSsGraph', function () {

  // load the directive's module and view
  beforeEach(module('proteoWebApp'));
  beforeEach(module('components/graphing/itasserSsGraph/itasserSsGraph.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<itasser-ss-graph></itasser-ss-graph>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the itasserSsGraph directive');
  }));
});
