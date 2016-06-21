'use strict';

angular.module('proteoWebApp')
  .config(function($routeProvider) {
    $routeProvider
      .when('/orf/single/:projectName/:datasetName/:orfName', {
        templateUrl: 'app/orf/single/single.html',
        controller: 'OrfSingleCtrl'
      });
  });
