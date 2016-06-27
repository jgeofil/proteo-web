'use strict';

describe('Directive: orfAnalysisPanel', function () {

  // load the directive's module and view
  beforeEach(module('proteoWebApp'));
  beforeEach(module('components/directives/orf-analysis-panel/orf-analysis-panel.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<orf-analysis-panel></orf-analysis-panel>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the orfAnalysisPanel directive');
  }));
});
