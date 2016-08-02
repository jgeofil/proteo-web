'use strict';

angular.module('proteoWebApp')
  .service('Orf', function ($http, $q, Download) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    //TODO: abp base path should be in ORF object, returned by server

    /**
     * Gets an ORF, including the full analyses.
     * @param {String} abp The path to the ORF.
     * @return {Object} Promise.
     */
    this.getFullOrf = function(abp){
      return $http.get(abp+'/full').then(function(response){
        return response.data;
      });
    };

    /**
     * Gets a list of all the images for an ORF.
     * @param {String} abp The path to the ORF.
     * @return {Object} Promise.
     */
    this.getImages = function(abp){
      return $http.get(abp + '/analysis/images/').then(function(response){
        return response.data;
      });
    };

    this.getImageLink = function(abp, img){
      Download.getLink(abp + '/analysis/images/' + img.name, 'image/jpeg').then(function(link){
        img.url = link;
      });
    };

    this.getModels = function(abp) {
      return $http.get(abp + '/analysis/models').then(function(response){
        return response.data;
      });
    };

    this.getModelData = function(abp, name){
      return $http.get(abp + '/analysis/models/' + name);
    };

    /**
     * Fetches the data strings for the Itasser models of an ORF.
     * @param {Object} orf The ORF.
     * @param {String} abp The path to the ORF.
     * @return {Object} Promise, resolving to an array of the models.
     */
    this.getItasserModelsData = function(orf, abp){
      var deferred = $q.defer();

      var ms = orf.analysis.itasser.data.other.models || [];
      var count = 0;

      ms.forEach(function(model){
        $http.get(abp + '/analysis/itasser/models/' + model.name)
        .then(function(data){

          model.data = data.data;
          count++;
          if(count === ms.length){
            deferred.resolve(ms);
          }

        });
      });

      return deferred.promise;
    };


  });
