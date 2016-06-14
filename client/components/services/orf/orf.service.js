'use strict';

angular.module('proteoWebApp')
  .service('orf', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function

    function getOrfBase (path){
      return $http.get(abp).then(function(response){
        $scope.metadata = response.data.meta;
        $scope.orfObj = response.data;
        if($scope.orfObj.sequence.length > 0){
          $scope.state.primary.isPresent = true;
        }

      }, handleErrors);
    }


  });
