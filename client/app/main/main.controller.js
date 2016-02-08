'use strict';
//TODO: include D3 in a more Angular way
/* jshint undef: false*/
angular.module('proteoWebApp')
.controller('MainController', function ($scope, $http, $routeParams, $rootScope, NgTableParams) {

  $scope.dataSelect = null;
  $scope.orfSelect = null;

  var dataTableParameters = {
    page: 1,
    count: 10,
    filter: {name:''}
  };
  var dataTableSetting = {
  };

  var orfTableSetting = {
  };

  $http.get('/api/data').then(function(response){
    $scope.dataSets = response.data;
    dataTableSetting.data = response.data;
    $scope.tableParams = new NgTableParams(dataTableParameters, dataTableSetting);
  }, function(error){
    console.log(error);
    //TODO: Show message
  });

  $scope.getOrfs = function(dataset){
    $scope.dataSelect = dataset;

    $http.get('/api/data/'+dataset+'/orf').then(function(response){
      $scope.orfSets = response.data;
      orfTableSetting.data = response.data;
      $scope.tableParamsOrf = new NgTableParams(dataTableParameters, orfTableSetting);
    }, function(error){
      console.log(error);
      //TODO: Show message
    });
  };

  $scope.resetData = function(){
    $scope.dataSelect = null;
    $scope.orfSets = [];
  };


});
