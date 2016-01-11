'use strict';

angular.module('proteoWebApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/proj/:projectName/seq/:sequenceName/orf/:orfName', {
        templateUrl: 'app/orf/orf.html',
        controller: 'OrfCtrl'
      });
  });
