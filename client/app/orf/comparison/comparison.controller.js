'use strict';

angular.module('proteoWebApp')
  .controller('OrfComparisonCtrl', function ($scope, $http, $routeParams, $rootScope, $uibModal, Download, Orf) {

    var rp = $routeParams;

    $scope.firstClosed = {
      disopred: true,
      topcons: true,
      itasser: true,
      tmhmm: true,
      primary: true
    };

    function mergePresent (orf){
      $scope.firstClosed = {
        disopred: orf.analysis.disopred && $scope.firstClosed.disopred,
        topcons: orf.analysis.topcons && $scope.firstClosed.topcons,
        itasser:  orf.analysis.itasser && $scope.firstClosed.itasser,
        tmhmm: orf.analysis.tmhmm && $scope.firstClosed.tmhmm,
        primary: (orf.sequence.length > 0) && $scope.firstClosed.primary
      };
    }

    var paths = [rp.oN1,rp.oN2];
    $scope.orfs = [];

    if(rp.oN3){paths.push(rp.oN3);}
    if(rp.oN4){paths.push(rp.oN4);}

    $scope.cols = 12/paths.length;

    paths.forEach(function(p){
      Orf.getFullOrf(p).then(function(resp){
        $scope.orfs.push(resp);
        mergePresent(resp);
      });
    });


  });
