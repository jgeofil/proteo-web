'use strict';

angular.module('proteoWebApp')
  .service('Orf', function ($http, $q) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    //TODO: abp base path should be in ORF object, returned by server

    this.getFullOrf = function(abp){
      return $http.get(abp+'/full').then(function(response){
        return response.data;
      });
    };

    this.getItasserModelsData = function(orf, abp){
      var deferred = $q.defer();

      var ms = orf.analysis.itasser.models;
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
