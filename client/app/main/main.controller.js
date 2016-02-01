'use strict';
//TODO: include D3 in a more Angular way
/* jshint undef: false*/
angular.module('proteoWebApp')
.controller('MainController', function ($scope, $http, $routeParams, $rootScope) {

  $scope.dataSets = [];
  $scope.dataSelect = null;
  $scope.orfSets = [];
  $scope.orfSelect = null;

  $http.get('/api/data').then(function(response){
    $scope.dataSets = response.data;
  }, function(error){

  });

  $scope.getOrfs = function(dataset){
    $scope.dataSelect = dataset;

    $http.get('/api/data/'+dataset+'/orf').then(function(response){
      $scope.orfSets = response.data;
    }, function(error){

    });
  };

  $scope.resetData = function(){
    $scope.dataSelect = null;
    $scope.orfSets = [];
  };
});
