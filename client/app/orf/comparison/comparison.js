'use strict';

angular.module('proteoWebApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/orf/comparison/:pN1/:dN1/:oN1/:pN2/:dN2/:oN2/:pN3?/:dN3?/:oN3?/:pN4?/:dN4?/:oN4?',
      {
        templateUrl: 'app/orf/comparison/comparison.html',
        controller: 'OrfComparisonCtrl'
      });
  });
