'use strict';

describe('Directive: orfImageCarousel', function () {

  // load the directive's module and view
  beforeEach(module('proteoWebApp'));
  beforeEach(module('app/components/directives/orf-image-carousel/orf-image-carousel.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<orf-image-carousel></orf-image-carousel>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the orfImageCarousel directive');
  }));
});
