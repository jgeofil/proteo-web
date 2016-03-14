'use strict';

angular.module('proteoWebApp')
  .config(function($routeProvider) {
    $routeProvider
      .when('/orf/:projectName/:datasetName/:orfName', {
        templateUrl: 'app/orf/orf.html',
        controller: 'OrfCtrl'
      });
  });
