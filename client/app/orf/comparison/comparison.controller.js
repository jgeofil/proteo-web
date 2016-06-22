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
      Orf.getFullOrf($scope.abp2).then(function(resp){
        $scope.oflOrf2 = resp;
        $scope.firstClosed = {
          disopred: $scope.oflOrf1.analysis.disopred && $scope.oflOrf2.analysis.disopred,
          topcons: $scope.oflOrf1.analysis.topcons && $scope.oflOrf2.analysis.topcons,
          itasser: $scope.oflOrf1.analysis.itasser && $scope.oflOrf2.analysis.itasser,
          tmhmm: $scope.oflOrf1.analysis.tmhmm && $scope.oflOrf2.analysis.tmhmm,
          primary: ($scope.oflOrf1.sequence.length > 0) && ($scope.oflOrf2.sequence.length > 0)
        };

      });
    });

    // Page title, aka ORF name
    $scope.orfName1 = $routeParams.orfName1;
    $scope.orfName2 = $routeParams.orfName2;

  });
