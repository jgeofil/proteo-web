'use strict';

angular.module('proteoWebApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/orf/comparison/:projectName1/:datasetName1/:orfName1/' +
                            ':projectName2/:datasetName2/:orfName2', {
        templateUrl: 'app/orf/comparison/comparison.html',
        controller: 'OrfComparisonCtrl'
      });
  });
