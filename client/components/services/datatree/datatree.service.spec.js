'use strict';

describe('Service: datatree', function () {

  // load the service's module
  beforeEach(module('proteoWebApp'));

  // instantiate service
  var datatree;
  beforeEach(inject(function (_datatree_) {
    datatree = _datatree_;
  }));

  it('should do something', function () {
    expect(!!datatree).toBe(true);
  });

});
