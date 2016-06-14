'use strict';

describe('Directive: orfFullLayout', function () {

  // load the directive's module and view
  beforeEach(module('proteoWebApp'));
  beforeEach(module('components/directives/orf-full-layout/orf-full-layout.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<orf-full-layout></orf-full-layout>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the orfFullLayout directive');
  }));
});
