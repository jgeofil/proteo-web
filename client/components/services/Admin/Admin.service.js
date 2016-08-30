'use strict';

angular.module('proteoWebApp')
  .service('Admin', function ($http) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    function respData (resp){return resp.data;}

    this.getListOfFolders = function(){
      return $http.get('/api/data/list').then(respData);
    };
    this.addProject = function(name){
      return $http.post('/api/data/add/project/'+name);
    };
    this.listProjects = function(){
      return $http.get('/api/data/list/projects');
    };
    this.listDatasets = function(projectId){
      return $http.get('/api/data/list/datasets/'+projectId).then(respData);
    };
    this.addDataset = function(projectId, datasetName){
      return $http.post('/api/data/add/dataset/'+datasetName+'/to/'+projectId);
    };
    this.addOrf = function(datasetId, orfName){
      return $http.post('/api/data/add/orf/'+orfName+'/to/'+datasetId);
    };
  });
