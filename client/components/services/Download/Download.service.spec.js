'use strict';

describe('Service: download', function () {

  // load the service's module
  beforeEach(module('proteoWebApp'));

  // instantiate service
  var download;
  beforeEach(inject(function (_download_) {
    download = _download_;
  }));

  it('should do something', function () {
    expect(!!download).toBe(true);
  });

});
