'use strict';

describe('Service: d3Helper', function () {

  // load the service's module
  beforeEach(module('proteoWebApp'));

  // instantiate service
  var d3Helper;
  beforeEach(inject(function (_d3Helper_) {
    d3Helper = _d3Helper_;
  }));

  it('should do something', function () {
    expect(!!d3Helper).toBe(true);
  });

});
