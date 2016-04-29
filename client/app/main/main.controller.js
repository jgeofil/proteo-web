'use strict';
//TODO: include D3 in a more Angular way
/* jshint undef: false*/
angular.module('proteoWebApp')
.controller('MainController', function ($scope, $http, $location, $routeParams, $timeout , $rootScope, NgTableParams) {

  // If data is being loaded from server
  $scope.dataIsLoading = true;

  // If data is present for each level
  $scope.data = {
    projects: false,
    datasets: false,
    orfs: false
  };
  // Tables containing data
  $scope.table = {
    projects: undefined,
    datasets: undefined,
    orfs: undefined
  };
  // Selected project and dataset
  $scope.select = {
    project: undefined,
    dataset: undefined
  };

  var tableParameters = {
    page: 1,
    count: 10
  };

  // Get projects
  $http.get('/api/data').then(function(response){
    $timeout(function(){
      $scope.data.projects = true;
      $scope.table.projects = new NgTableParams(tableParameters, {data: response.data});
      $scope.dataIsLoading = false;
    });

  }, function(error){
    $scope.dataIsLoading = false;
    console.log(error);
    //TODO: Show message
  });

  // Sort datasets by number of available analyses
  var dataSort = function(data){
    data.sort(function(a,b){
      if(a.analyses && b.analyses){
        return ((b.analyses.disopred?1:0) + (b.analyses.itasser?1:0) + (b.analyses.tmhmm?1:0) +
        (b.analyses.topcons?1:0))-((a.analyses.disopred?1:0) + (a.analyses.itasser?1:0) + (a.analyses.tmhmm?1:0) + (a.analyses.topcons?1:0));
      }else{
        return 0;
      }
    });
  };

  var setProperty = function(data, property){
    data = data.map(function(d){
      if(d.hasOwnProperty('meta')){
        d[property] = d.meta[property];
        return d;
      }
    });
  };

  // Get datasets for specified project
  $scope.getDatasets = function(project, setLoc){
    $scope.dataIsLoading = true;
    $scope.data.datasets = false;
    $scope.selectedProject = project;
    if(!setLoc) {
      $location.search({project: project});
    }
    return $http.get('/api/data/'+project).then(function(response){
      $timeout(function(){
        setProperty(response.data, 'organism');
        $scope.table.datasets = new NgTableParams(tableParameters, {data: response.data});
        $scope.data.datasets = true;
        $scope.dataIsLoading = false;
      });
    }, function(error){
      $scope.dataIsLoading = false;
      console.log(error);
      //TODO: Show message
    });
  };

  // Get ORFs for specified dataset
  $scope.getOrfs = function(dataset, setLoc){
    $scope.dataIsLoading = true;
    $scope.data.orfs = false;
    $scope.selectedDataset = dataset;
    if(!setLoc) {
      $location.search({project: $scope.selectedProject, dataset: dataset});
    }

    $http.get('/api/data/'+$scope.selectedProject+'/dataset/'+dataset).then(function(response){

      $timeout(function(){
        dataSort(response.data);
        $scope.table.orfs = new NgTableParams(tableParameters, {data: response.data});
        $scope.data.orfs = true;
        $scope.dataIsLoading = false;
      });

    }, function(error){
      $scope.dataIsLoading = false;
      console.log(error);
      //TODO: Show message
    });
  };


  // Reset to initial view
  $scope.reset = function(){
    $scope.data = {
      projects: true,
      datasets: false,
      orfs: false
    };

    $scope.selectedDataset = undefined;
    $scope.selectedProject = undefined;

    $location.search({});
  };

  // Reset to previously selected project
  $scope.resetToProject = function(){
    $scope.selectedDataset = undefined;
    $scope.data.orfs = false;
    $scope.data.dataset = false;
    $location.search({project: $scope.selectedProject});
  };

  // Set location from URL
  var search = $location.search();
  if(search.project){
    $scope.getDatasets(search.project, true).then(function(){
      if(search.dataset){
        $scope.getOrfs(search.dataset, true);
      }
    });
  }


});
