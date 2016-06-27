'use strict';

angular.module('proteoWebApp')
  .controller('OrfComparisonCtrl', function ($scope, $http, $routeParams, $rootScope, $uibModal, Download, Orf) {

    var rp = $routeParams;

    function getBp (pN, dN, oN){
      return '/api/data/'+pN+'/dataset/'+dN+'/orf/'+oN;
    }

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

    var paths = [];
    $scope.orfs = [];

    // Base path for API
    paths.push(getBp(rp.pN1, rp.dN1, rp.oN1));
    paths.push(getBp(rp.pN2, rp.dN2, rp.oN2));
    if(rp.pN3 && rp.dN3 && rp.oN3){paths.push(getBp(rp.pN3, rp.dN3, rp.oN3));}
    if(rp.pN4 && rp.dN4 && rp.oN4){paths.push(getBp(rp.pN4, rp.dN4, rp.oN4));}

    $scope.cols = 12/paths.length;

    paths.forEach(function(p){
      Orf.getFullOrf(p).then(function(resp){
        $scope.orfs.push(resp);
        mergePresent(resp);
      });
    });


  });
