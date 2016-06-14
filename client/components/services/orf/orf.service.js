'use strict';

angular.module('proteoWebApp')
  .service('Orf', function ($http) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    this.getFullOrf = function(abp){
      return $http.get(abp+'/full').then(function(response){
        return response.data;
      });
    };


  });
