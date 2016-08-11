'use strict';

angular.module('proteoWebApp')
  .service('Datatree', function ($http) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    //TODO: put this service somewhere else....

    // Get list of all available projects
    this.getProjectList = function(){
      return $http.get('/api/data');
    };

    this.getListOfOrfs = function(projectId, datasetId){
      return $http.get('/api/data/'+projectId+'/dataset/'+datasetId);
    };


  });
