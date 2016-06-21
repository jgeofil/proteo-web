'use strict';

angular.module('proteoWebApp')
  .controller('OrfComparisonCtrl', function ($scope, $http, $routeParams, $rootScope, $uibModal, Download, Orf) {

    // Base path for API
    $scope.abp1 = '/api/data/'+$routeParams.projectName1+'/dataset/'+
      $routeParams.datasetName1+'/orf/'+$routeParams.orfName1;
    $scope.abp2 = '/api/data/'+$routeParams.projectName2+'/dataset/'+
      $routeParams.datasetName2+'/orf/'+$routeParams.orfName2;

    Orf.getFullOrf($scope.abp1).then(function(resp){
      $scope.oflOrf1 = resp;
      console.log(resp)

    });
    Orf.getFullOrf($scope.abp2).then(function(resp){
      $scope.oflOrf2 = resp;
            console.log(resp)
    });

    // Page title, aka ORF name
    $scope.orfName1 = $routeParams.orfName1;
    $scope.orfName2 = $routeParams.orfName2;

  });
