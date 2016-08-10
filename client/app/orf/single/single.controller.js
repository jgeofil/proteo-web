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
    $scope.images = resp.files.images;
    $scope.images.forEach(function(img){
      Orf.getImageLink('/api/data', img);
    });
    var count = 0;
    $scope.models = resp.files.models;

    // Get PDB files for each model
    $scope.models.forEach(function(model){
      $http.get('/api/data/files/models/' + model._id)
      .then(function(md){

        model.data = md.data;
        console.log(model)
        count +=1;
        if(count === $scope.models.length-1){
          $scope.modelsLoaded = true;
        }
      });
    });
    Orf.getItasserModelsData($scope.oflOrf, $scope.abp).then(function(ms){
      console.log(ms)
      $scope.oflOrfMs = ms;
    });
  });

  // Page title, aka ORF name
  $scope.orfName = $routeParams.orfName;

});
