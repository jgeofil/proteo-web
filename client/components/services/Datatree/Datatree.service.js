'use strict';

angular.module('proteoWebApp')
  .service('Datatree', function ($http, $route) {
    // AngularJS will instantiate a singleton by calling "new" on this function


    function routeReload(){
      return $route.reload();
    }

    this.getProjectList = function(){
      return $http.get('/api/data')
        .then(function(response){
          return response.data;
        });
    };

    this.getListOfOrfs = function(datasetId){
      return $http.get('/api/data/dataset/'+datasetId)
        .then(function(response){
          return response.data;
        });
    };

    this.getListOfDatasets = function(projectId){
      return $http.get('/api/data/'+projectId)
        .then(function(response){
          return response.data;
        });
    };

    this.removeAllData = function(){
      return $http.post('/api/data/update', {});
    };

    this.removeOrf = function(orfId){
      return $http.get('/api/data/delete/orf/'+orfId).then(routeReload);
    };
    this.removeDataset= function(datasetId){
      return $http.get('/api/data/delete/dataset/'+datasetId).then(routeReload);
    };
    this.removeProject = function(projectId){
      return $http.get('/api/data/delete/project/'+projectId).then(routeReload);
    };


  });
