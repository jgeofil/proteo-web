'use strict';

angular.module('proteoWebApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/orf/comparison/:oN1/:oN2/:oN3?/:oN4?',
      {
        templateUrl: 'app/orf/comparison/comparison.html',
        controller: 'OrfComparisonCtrl'
      });
  });
