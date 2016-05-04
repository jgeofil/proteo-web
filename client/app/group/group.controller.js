'use strict';

angular.module('proteoWebApp')
  .controller('GroupCtrl', function ($scope, $http, $routeParams, NgTableParams,
     socket, Auth, ngToast, Datatree, User, $timeout) {

    $scope.group = {};

    //**************************************************************************
    // List of existing projects for autocomplete
    $scope.projects = [];
    Datatree.getProjectList().then(function(success){
      $scope.projects = success.data;
    });

    //**************************************************************************
    // List of users for autocomplete
    $scope.users = [];
    User.query().$promise.then(function (result) {
      $scope.users = result;
    });

    //**************************************************************************
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

    //**************************************************************************
    // Create and add new user to group
    function resetCreateForm (){
      $scope.createSubmitted = false;
      $scope.createUser = {};
      $scope.createErrors = {};
    }
    resetCreateForm();

    $scope.createAndAddUser = function(form) {
      $scope.createSubmitted = true;

      if (form.$valid) {
        Auth.createUserAsAdmin({
          name: $scope.createUser.name,
          email: $scope.createUser.email,
          password: $scope.createUser.password
        })
        .then(() => {
          // Account created
          ngToast.create({
            className: 'success',
            content: 'User <b>'+$scope.createUser.email+'</b> created.',
            timeout: 3000
          });
          $scope.addUser($scope.createUser.email).then(function(){
            resetCreateForm();
          });
        })
        .catch(err => {
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
      return $http.patch('/api/groups/' + $routeParams.groupId + '/adduser', {email: userEmail}).then(function(){
        // User added to group
        ngToast.create({
          className: 'success',
          content: 'User <b>'+userEmail+'</b> added to this group.',
          timeout: 3000
        });
      }, function(error){
        console.log(error);
        // User could not be added
        ngToast.create({
          className: 'danger',
          content: 'User <b>'+userEmail+'</b> could not be added to this group...',
          timeout: 5000
        });
      });
    };

    $scope.removeUser = function(id){
      $http.patch('/api/groups/' + $routeParams.groupId + '/removeuser/'+ id).then(function(){
        ngToast.create({
          className: 'success',
          content: 'User with ID <b>'+id+'</b> removed from this group.',
          timeout: 3000
        });
      }, function(error){
        console.log(error);
        ngToast.create({
          className: 'danger',
          content: 'User with ID <b>'+id+'</b> could not be removed from this group...',
          timeout: 5000
        });
      });
    };

    //**************************************************************************
    // Add and and remove permissions
    $scope.addPerm = function(perm, other){
      $http.patch('/api/groups/' + $routeParams.groupId + '/addset/'+ perm.title).then(function(){
        ngToast.create({
          className: 'success',
          content: 'Permission on <b>'+perm.title+'</b> added for this group.',
          timeout: 3000
        });
      }, function(error){
        console.log(error);
        ngToast.create({
          className: 'danger',
          content: 'Permission on <b>'+perm.title+'</b> could not be added...',
          timeout: 5000
        });
      });
    };

    $scope.removePerm = function(perm){
      $http.patch('/api/groups/' + $routeParams.groupId + '/remove/'+ perm).then(function(){
        ngToast.create({
          className: 'success',
          content: 'Permission on <b>'+perm+'</b> removed for this group.',
          timeout: 3000
        });
      }, function(error){
        console.log(error);
        ngToast.create({
          className: 'danger',
          content: 'Permission on <b>'+perm+'</b> could not be removed...',
          timeout: 5000
        });
      });
    };

    //**************************************************************************
    //  Sync changes made to Group
    function updateData (data) {
      userTableSetting.data = data.users;
      permTableSetting.data = permLtoObj(data);
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
    //  Get the group
    $http.get('/api/groups/'+ $routeParams.groupId).then(function(response){
      updateData(response.data);
      $scope.groupName = response.data.name;
    }, function(error){
      console.log(error);
      ngToast.create({
        className: 'danger',
        content: 'Error fetching group...',
        timeout: 5000
      });
    });
  });
