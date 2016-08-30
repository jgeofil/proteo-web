'use strict';

describe('Service: orf', function () {

  // load the service's module
  beforeEach(module('proteoWebApp'));

  // instantiate service
  var orf;
  beforeEach(inject(function (_orf_) {
    orf = _orf_;
  }));

  it('should do something', function () {
    expect(!!orf).toBe(true);
  });

});
