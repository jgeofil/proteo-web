'use strict';

angular.module('proteoWebApp')
  .service('Datatree', function ($http) {
    // AngularJS will instantiate a singleton by calling "new" on this function

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

  });
