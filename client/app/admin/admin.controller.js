'use strict';

(function() {

angular.module('proteoWebApp.admin')
  .controller('AdminController', function(User, $scope, $http){
    $scope.users = User.query();

    $scope.delete = function (user) {
      user.$remove();
      $scope.users.splice($scope.users.indexOf(user), 1);
    };

    $http.get('/api/groups/').then(function(response){
      console.log(response)
      $scope.groups = response.data;
    }, function(error){
      console.log(error);
      //TODO: Show message
    });
  });
})();
