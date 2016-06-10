'use strict';

describe('Directive: fileDownloadButton', function () {

  // load the directive's module and view
  beforeEach(module('proteoWebApp'));
  beforeEach(module('components/directives/file-download-button/file-download-button.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<file-download-button></file-download-button>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the fileDownloadButton directive');
  }));
});
