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
    this.getFullOrf = function(orfId){
      return $http.get('/api/data/orf/'+orfId+'/full').then(function(response){
        console.log(response.data)
        return response.data;
      });
    };

    this.getImageLink = function(img){
      Download.getLink('/api/data/files/images/' + img._id, 'image/jpeg').then(function(link){
        img.url = link;
      });
    };

    this.getModelData = function(id){
      return $http.get('/api/data/files/models/'+ id);
    };

    /**
     * Fetches the data strings for the Itasser models of an ORF.
     * @param {Object} orf The ORF.
     * @param {String} abp The path to the ORF.
     * @return {Object} Promise, resolving to an array of the models.
     */
    this.getItasserModelsData = function(orf){
      var deferred = $q.defer();

      var ms = orf.analysis.itasser.data.other.models || [];
      var count = 0;

      ms.forEach(function(model){
        $http.get('/api/data/files/models/' + model._id)
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
