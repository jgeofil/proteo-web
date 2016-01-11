'use strict';

angular.module('proteoWebApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/proj', {
        templateUrl: 'app/proj/proj.html',
        controller: 'ProjCtrl'
      });
  });
