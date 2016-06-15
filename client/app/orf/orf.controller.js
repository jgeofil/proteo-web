'use strict';
//TODO: include D3 in a more Angular way
/* jshint undef: false*/
angular.module('proteoWebApp')
.controller('OrfCtrl', function ($scope, $http, $routeParams, $rootScope, $uibModal, Download, Orf) {

  $scope.downData = Download.triggerDownloadFromData;
  $scope.downUrl = Download.triggerDownloadFromUrl;

  // Base path for API
  $scope.abp = '/api/data/'+$routeParams.projectName+'/dataset/'+
    $routeParams.datasetName+'/orf/'+$routeParams.orfName;

  Orf.getFullOrf($scope.abp).then(function(resp){
    $scope.oflOrf = resp;
    console.log(resp)
    Orf.getItasserModelsData($scope.oflOrf, $scope.abp).then(function(ms){
      $scope.oflOrfMs = ms;
    });
  });

  Orf.getFullOrf($scope.abp).then(function(resp){
    $scope.oflOrf2 = resp;
    Orf.getItasserModelsData($scope.oflOrf2, $scope.abp).then(function(ms){
      $scope.oflOrfMs2 = ms;
    });
  });




  // Handle errors while fetching data
  function handleErrors(err){
    console.log(err);
  }

  // Page title, aka ORF name
  $scope.orfName = $routeParams.orfName;


  //**************************************************************************
  // ORF
  //**************************************************************************
  $http.get($scope.abp).then(function(response){
    $scope.metadata = response.data.meta;
    $scope.orfObj = response.data;
    if($scope.orfObj.sequence.length > 0){
      $scope.state.primary.isPresent = true;
    }

  }, handleErrors);

  //**************************************************************************
  // Images
  //**************************************************************************
  var imgBasePath = $scope.abp + '/analysis/images/';

  $http.get(imgBasePath).then(function(response){
      $scope.images = response.data;
      $scope.images.forEach(function(img){
        Download.getLink(imgBasePath + img.name, 'image/jpeg').then(function(link){
          img.url = link;
        });
      });
  }, handleErrors);



  //**************************************************************************
  // Models
  //**************************************************************************
  $http.get($scope.abp + '/analysis/models')
  .then(function(data){
    var count = 0;
    $scope.models = data.data.data;

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
    }, handleErrors);
  }, handleErrors);


})
