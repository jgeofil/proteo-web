'use strict';

angular.module('proteoWebApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/devel', {
        templateUrl: 'app/devel/devel.html',
        controller: 'DevelCtrl'
      });
  });
