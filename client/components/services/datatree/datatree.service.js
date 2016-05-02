'use strict';

angular.module('proteoWebApp')
  .service('Datatree', function ($http) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    // Get list of all available projects
    this.getProjectList = function(){
      return $http.get('/api/data');
    };


  });
