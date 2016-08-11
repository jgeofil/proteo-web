'use strict';

angular.module('proteoWebApp')
  .config(function($routeProvider) {
    $routeProvider
      .when('/orf/single/:orfName', {
        templateUrl: 'app/orf/single/single.html',
        controller: 'OrfSingleCtrl'
      });
  });
