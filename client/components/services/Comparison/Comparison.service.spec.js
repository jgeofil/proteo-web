'use strict';

describe('Service: comparison', function () {

  // load the service's module
  beforeEach(module('proteoWebApp'));

  // instantiate service
  var comparison;
  beforeEach(inject(function (_comparison_) {
    comparison = _comparison_;
  }));

  it('should do something', function () {
    expect(!!comparison).toBe(true);
  });

});
