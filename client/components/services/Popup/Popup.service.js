'use strict';

angular.module('proteoWebApp')
  .service('Popup', function (ngToast) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    function toastSuccess (message){
      ngToast.create({
        className: 'success',
        content: message,
        timeout: 3000
      });
    }
    function toastFailure (message, error){
      console.log(error);
      ngToast.create({
        className: 'danger',
        content: message,
        timeout: 5000
      });
    }
    this.success = function (message){
      return function (){ toastSuccess(message);};
    };
    this.failure = function (message){
      return function (error){ toastFailure(message, error);};
    };
  });
