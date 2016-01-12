'use strict';

angular.module('proteoWebApp')
  .controller('OrfCtrl', function ($scope, $http, $stateParams) {
    $http.get('/api/data/dataset-01/orf/orf47/analysis/disopred3').then(function(data){
      $scope.disopred3 = data;
    });
  });
