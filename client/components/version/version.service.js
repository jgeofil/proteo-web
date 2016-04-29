'use strict';

angular.module('proteoWebApp')
  .service('version', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function

    this.getVersion = function(){
      return '0.2.1';
    };
  });
