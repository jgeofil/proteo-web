'use strict';

angular.module('proteoWebApp')
  .controller('GroupCtrl', function ($scope, $http, $routeParams, NgTableParams, socket) {

    $scope.group = {};

    var userTableParameters = {
      page: 1,
      count: 10,
      filter: {name:''}
    };
    var userTableSetting = {};

    var permTableParameters = {
      page: 1,
      count: 10,
      filter: {name:''}
    };
    var permTableSetting = {};

    function permLtoObj (data) {
      var l = [];
      data.permissions = data.permissions.map(function(i){
        l.push({name: i});
      });
      return l;
    }

    $scope.addUser = function(user){
      $http.patch('/api/groups/' + $routeParams.groupId + '/adduser', {email: user}).then(function(response){
        console.log(response);

      }, function(error){
        console.log(error);
        //TODO: Show message
      });
      $scope.newUser = '';
    };

    $scope.addPerm = function(perm){
      $http.patch('/api/groups/' + $routeParams.groupId + '/addset/'+ perm).then(function(response){
        console.log(response);
      }, function(error){
        console.log(error);
        //TODO: Show message
      });
      $scope.newPerm = '';
    };

    $scope.removePerm = function(perm){
      $http.patch('/api/groups/' + $routeParams.groupId + '/remove/'+ perm).then(function(response){
        console.log(response);
      }, function(error){
        console.log(error);
        //TODO: Show message
      });
    };

    $scope.removeUser = function(id){
      $http.patch('/api/groups/' + $routeParams.groupId + '/removeuser/'+ id).then(function(response){
        console.log(response);
      }, function(error){
        console.log(error);
        //TODO: Show message
      });
    };



    function updateData (data) {
      userTableSetting.data = data.users;
      permTableSetting.data = permLtoObj(data);
      //socket.syncUpdates('Group', )
      $scope.userTableParams = new NgTableParams(userTableParameters, userTableSetting);
      $scope.permTableParams = new NgTableParams(permTableParameters, permTableSetting);
    }

    socket.syncUpdates('group', [], function(ev, it){
      updateData(it);
    });

    $http.get('/api/groups/'+ $routeParams.groupId).then(function(response){
      updateData(response.data);
    }, function(error){
      console.log(error);
      //TODO: Show message
    });
  });
