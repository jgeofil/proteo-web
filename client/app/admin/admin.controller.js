'use strict';

(function() {

angular.module('proteoWebApp.admin')
  .controller('AdminController', function(User, $scope, $http, socket, NgTableParams){

    $scope.groups = [];

    var userTableParameters = {
      page: 1,
      count: 10,
      filter: {name:''}
    };
    var userTableSetting = {};

    User.query().$promise.then(function (result) {
        $scope.users = result;
        userTableSetting.data = $scope.users;
        $scope.userTableParams = new NgTableParams(userTableParameters, userTableSetting);
    });

    $scope.delete = function (user) {
      user.$remove();
      $scope.users.splice($scope.users.indexOf(user), 1);
      userTableSetting.data = $scope.users;
      $scope.userTableParams = new NgTableParams(userTableParameters, userTableSetting);
    };

    $scope.addGroup = function(group){
      $http.post('/api/groups/', {name: group}).then(function(response){
        //TODO: inform user
      }, function(error){
        console.log(error);
        //TODO: Show message
      });
      $scope.newGroup = '';
    };

    $scope.removeGroup = function(groupId){
      $http.delete('/api/groups/' + groupId).then(function(response){
        //TODO: inform user
      }, function(error){
        console.log(error);
        //TODO: Show message
      });
    };

    $http.get('/api/groups/').then(function(response){
      $scope.groups = response.data;
      socket.syncUpdates('group', $scope.groups);
    }, function(error){
      console.log(error);
      //TODO: Show message
    });

  });
})();
