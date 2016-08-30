'use strict';

describe('Service: Popup', function () {

  // load the service's module
  beforeEach(module('proteoWebApp'));

  // instantiate service
  var Popup;
  beforeEach(inject(function (_Popup_) {
    Popup = _Popup_;
  }));

  it('should do something', function () {
    expect(!!Popup).toBe(true);
  });

});
