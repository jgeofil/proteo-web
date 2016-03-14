'use strict';
//TODO: include D3 in a more Angular way
/* jshint undef: false*/
angular.module('proteoWebApp')
.controller('MainController', function ($scope, $http, $routeParams, $rootScope, NgTableParams) {

  $scope.projectSelect = true;

  $scope.data = {
    projects: false,
    datasets: false,
    orfs: false
  };
  $scope.table = {
    projects: undefined,
    datasets: undefined,
    orfs: undefined
  };
  $scope.select = {
    project: undefined,
    dataset: undefined
  };

  var tableParameters = {
    page: 1,
    count: 10
  };
  var projectsTableSetting = {
  };
  var datasetsTableSetting = {
  };
  var orfsTableSetting = {
  };

  $http.get('/api/data').then(function(response){
    $scope.data.projects = true;
    projectsTableSetting.data = response.data;
    $scope.table.projects = new NgTableParams(tableParameters, projectsTableSetting);
  }, function(error){
    console.log(error);
    //TODO: Show message
  });

  var dataSort = function(data){
    data.sort(function(a,b){
      return ((b.disopred?1:0) + (b.itasser?1:0) + (b.tmhmm?1:0) + (b.topcons?1:0))-((a.disopred?1:0) + (a.itasser?1:0) + (a.tmhmm?1:0) + (a.topcons?1:0));
    });
  };

  $scope.getDatasets = function(project){
    $scope.data.datasets = false;
    $scope.select.project = project;

    $http.get('/api/data/'+project).then(function(response){

      datasetsTableSetting.data = response.data;
      $scope.table.datasets = new NgTableParams(tableParameters, datasetsTableSetting);
      $scope.data.datasets = true;
    }, function(error){
      console.log(error);
      //TODO: Show message
    });
  };

  $scope.getOrfs = function(dataset){
    $scope.data.orfs = false;
    $scope.select.dataset = dataset;

    $http.get('/api/data/'+$scope.select.project+'/dataset/'+dataset).then(function(response){
      dataSort(response.data);
      orfsTableSetting.data = response.data;
      $scope.table.orfs = new NgTableParams(tableParameters, orfsTableSetting);
      $scope.data.orfs = true;
    }, function(error){
      console.log(error);
      //TODO: Show message
    });
  };

  $scope.reset = function(){
    $scope.data = {
      projects: true,
      datasets: false,
      orfs: false
    };

    $scope.select = {
      project: undefined,
      dataset: undefined
    };
  };

  $scope.resetToProject = function(){
    $scope.select.dataset = undefined;
    $scope.data.orfs = false;
    $scope.data.dataset = false;
  };


});
