'use strict';

describe('Directive: orfPanelTitle', function () {

  // load the directive's module and view
  beforeEach(module('proteoWebApp'));
  beforeEach(module('components/directives/orf-panel-title/orf-panel-title.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<orf-panel-title></orf-panel-title>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the orfPanelTitle directive');
  }));
});
