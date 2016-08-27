'use strict';

angular.module('proteoWebApp')
  .controller('GroupCtrl', function ($scope, $http, $routeParams, NgTableParams,
     socket, Auth, ngToast, Datatree, User, $timeout, Group, Popup) {

    $scope.group = {};
    $scope.projects = [];
    $scope.users = [];
    $scope.createSubmitted = false;
    $scope.createUser = {};
    $scope.createErrors = {};

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

    function resetCreateForm (){
      $scope.createSubmitted = false;
      $scope.createUser = {};
      $scope.createErrors = {};
    }
    //**************************************************************************
    //  Sync changes made to Group
    function updateData (data) {
      userTableSetting.data = data.users;
      permTableSetting.data = data.permissions;
      //socket.syncUpdates('Group', )
      $timeout(function () {
        $scope.userTableParams = new NgTableParams(userTableParameters, userTableSetting);
        $scope.permTableParams = new NgTableParams(permTableParameters, permTableSetting);
      });
    }

    socket.syncUpdates('group', [], function(ev, it){
      updateData(it);
    });
    //**************************************************************************
    // List of existing projects for autocomplete
    Datatree.getProjectList().then(function(data){
      $scope.projects = data;
    });
    //**************************************************************************
    // List of users for autocomplete
    User.query().$promise.then(function (result) {
      $scope.users = result;
    });
    //**************************************************************************
    //  Get the group
    Group.getOne($routeParams.groupId)
      .then(function(data){
        updateData(data);
        $scope.groupName = data.name;
      })
      .catch(Popup.failure('Error fetching group...'));

    //**************************************************************************
    // Create and add new user to group
    $scope.createAndAddUser = function(form) {
      $scope.createSubmitted = true;

      if (form.$valid) {
        Auth.createUserAsAdmin({
          name: $scope.createUser.name,
          email: $scope.createUser.email,
          password: $scope.createUser.password
        })
        .then(function(){
          // Account created
          Popup.success('User <b>'+$scope.createUser.email+'</b> created.')();
          $scope.addUser($scope.createUser.email).then(function(){
            resetCreateForm();
          });
        })
        .catch(function(err){
          err = err.data;
          $scope.createErrors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, (error, field) => {
            form[field].$setValidity('mongoose', false);
            $scope.createErrors[field] = error.message;
          });
        });
      }
    };

    //**************************************************************************
    // Add user to group
    $scope.quickAddUser = function(user) {
      $scope.addUser(user.title);
    };
    //**************************************************************************
    // Add user and remove user by email
    $scope.addUser = function(userEmail){
      return Group.addUserToGroup($routeParams.groupId, userEmail)
        .then(Popup.success('User <b>'+userEmail+'</b> added to this group.'))
        .catch(Popup.failure('User <b>'+userEmail+'</b> could not be added to this group...'));
    };
    $scope.removeUser = function(userId){
      Group.removeUserFromGroup($routeParams.groupId, userId)
        .then(Popup.success('User with ID <b>'+userId+'</b> removed from this group.'))
        .catch(Popup.failure('User with ID <b>'+userId+'</b> could not be removed from this group...'));
    };
    //**************************************************************************
    // Add and and remove permissions
    $scope.addPerm = function(perm){
      Group.addPermissionToGroup($routeParams.groupId, perm.originalObject._id)
        .then(Popup.success('Permission on <b>'+perm.title+'</b> added for this group.'))
        .catch(Popup.failure('Permission on <b>'+perm.title+'</b> could not be added...'));
    };
    $scope.removePerm = function(perm){
      Group.removePermissionFromGroup($routeParams.groupId, perm)
      .then(Popup.success('Permission on <b>'+perm+'</b> removed for this group.'))
      .catch(Popup.failure('Permission on <b>'+perm+'</b> could not be removed...'));
    };
  });
