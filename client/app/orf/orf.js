'use strict';

angular.module('proteoWebApp')
  .config(function($routeProvider) {
    $routeProvider
      .when('/dataset', {
        templateUrl: 'app/orf/orf.html',
        controller: 'OrfCtrl'
      });
  });
