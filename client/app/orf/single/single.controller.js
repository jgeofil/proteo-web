'use strict';
//TODO: include D3 in a more Angular way
/* jshint undef: false*/
angular.module('proteoWebApp')
.controller('OrfSingleCtrl', function ($scope, $http, $routeParams, $rootScope,
  $uibModal, Download, Orf, Popup) {

  Orf.getFullOrf($routeParams.orfName)
    .then(function(resp){
      $scope.oflOrf = resp;
      $scope.images = resp.files.images;
      $scope.images.forEach(function(img){
        Orf.getImageLink(img);
      });

      var count = 0;
      $scope.models = resp.files.models;
      // Get PDB files for each model
      $scope.models.forEach(function(model){
        Orf.getModelData(model._id)
        .then(function(md){
          model.data = md.data;
          count +=1;
          if(count === $scope.models.length-1){
            $scope.modelsLoaded = true;
          }
        })
        .catch(Popup.failure('Error fetching model data.'));
      });

      Orf.getItasserModelsData($scope.oflOrf).then(function(ms){
        $scope.oflOrfMs = ms;
      })
      .catch(Popup.failure('Error fetching Itasser model data.'));
    });
});
