'use strict';

describe('Directive: metadataDisplay', function () {

  // load the directive's module and view
  beforeEach(module('proteoWebApp'));
  beforeEach(module('components/directives/metadata-display/metadata-display.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<metadata-display></metadata-display>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the metadataDisplay directive');
  }));
});
