'use strict';

describe('Directive: molecularModel', function () {

  // load the directive's module and view
  beforeEach(module('proteoWebApp'));
  beforeEach(module('components/molecularModel/molecularModel.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<molecular-model></molecular-model>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the molecularModel directive');
  }));
});
