'use strict';
//TODO: include D3 in a more Angular way
/* jshint undef: false*/
angular.module('proteoWebApp')
.controller('MainController', function ($scope, $http, $location, $routeParams, $rootScope, NgTableParams) {

  $scope.dataIsLoading = true;

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
    $scope.dataIsLoading = false;
    $scope.data.projects = true;
    projectsTableSetting.data = response.data;
    $scope.table.projects = new NgTableParams(tableParameters, projectsTableSetting);
  }, function(error){
    $scope.dataIsLoading = false;
    console.log(error);
    //TODO: Show message
  });

  var dataSort = function(data){
    data.sort(function(a,b){
      return ((b.analyses.disopred?1:0) + (b.analyses.itasser?1:0) + (b.analyses.tmhmm?1:0) +
      (b.analyses.topcons?1:0))-((a.analyses.disopred?1:0) + (a.analyses.itasser?1:0) + (a.analyses.tmhmm?1:0) + (a.analyses.topcons?1:0));
    });
  };

  $scope.getDatasets = function(project, setLoc){
    $scope.dataIsLoading = true;
    $scope.data.datasets = false;
    $scope.select.project = project;
    if(!setLoc) {
      $location.search({project: project});
    }
    return $http.get('/api/data/'+project).then(function(response){
      $scope.dataIsLoading = false;
      datasetsTableSetting.data = response.data;
      $scope.table.datasets = new NgTableParams(tableParameters, datasetsTableSetting);
      $scope.data.datasets = true;
    }, function(error){
      $scope.dataIsLoading = false;
      console.log(error);
      //TODO: Show message
    });
  };

  $scope.getOrfs = function(dataset, setLoc){
    $scope.dataIsLoading = true;
    $scope.data.orfs = false;
    $scope.select.dataset = dataset;
    if(!setLoc) {
      $location.search({project: $scope.select.project, dataset: dataset});
    }

    $http.get('/api/data/'+$scope.select.project+'/dataset/'+dataset).then(function(response){
      dataSort(response.data);
      $scope.dataIsLoading = false;
      orfsTableSetting.data = response.data;
      $scope.table.orfs = new NgTableParams(tableParameters, orfsTableSetting);
      $scope.data.orfs = true;
    }, function(error){
      $scope.dataIsLoading = false;
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

    $location.search({});
  };

  $scope.resetToProject = function(){
    $scope.select.dataset = undefined;
    $scope.data.orfs = false;
    $scope.data.dataset = false;
    $location.search({project: $scope.select.project});
  };

  var search = $location.search();
  if(search.project){
    $scope.getDatasets(search.project, true).then(function(){
      if(search.dataset){
        $scope.getOrfs(search.dataset, true);
      }
    });
  }


});
