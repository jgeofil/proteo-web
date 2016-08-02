'use strict';
//TODO: include D3 in a more Angular way
/* jshint undef: false*/
angular.module('proteoWebApp')
.controller('OrfSingleCtrl', function ($scope, $http, $routeParams, $rootScope, $uibModal, Download, Orf) {

  // Base path for API
  $scope.abp = '/api/data/'+$routeParams.projectName+'/dataset/'+
    $routeParams.datasetName+'/orf/'+$routeParams.orfName;

  Orf.getFullOrf($scope.abp).then(function(resp){
    $scope.oflOrf = resp;
    console.log(resp)
    $scope.images = resp.analysis.images.data;
    $scope.images.forEach(function(img){
      Orf.getImageLink($scope.abp, img);
    });
    Orf.getItasserModelsData($scope.oflOrf, $scope.abp).then(function(ms){
      console.log(ms)
      $scope.oflOrfMs = ms;
    });
  });

  // Page title, aka ORF name
  $scope.orfName = $routeParams.orfName;

  //**************************************************************************
  // Models
  //**************************************************************************

  Orf.getModels($scope.abp).then(function(data){
    var count = 0;
    $scope.models = data.data;

    // Get PDB files for each model
    $scope.models.forEach(function(model){
      $http.get($scope.abp + '/analysis/models/' + model.shortName)
      .then(function(md){

        model.data = md.data;
        count +=1;
        if(count === $scope.models.length-1){
          $scope.modelsLoaded = true;
        }
      });
    });
  });

});
