'use strict';

(function() {

angular.module('proteoWebApp.admin')
  .controller('AdminController', function(User, Admin, $scope, $http, $timeout, socket, NgTableParams, ngToast){

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

    Admin.getListOfFolders().then(function(response){
      $scope.folderList = response.data;
    }, function(error){
      console.log(error);
      //TODO: Show message
    });

    $scope.addProject = Admin.addProject;
    $scope.folderName = '';
    $scope.projectList = '';
    $scope.datasetList = '';
    $scope.projectListFunc = undefined;
    $scope.setFolderName = function(name){
      $scope.folderName = name;
    };
    $scope.addProject = function(){
      Admin.addProject($scope.folderName);
      $scope.folderName = '';
    };
    $scope.asDataset = function(){
      $scope.projectListFunc = $scope.addDataset;
      Admin.listProjects().then(function(response){
        $scope.projectList = response.data;
      }, function(error){
        console.log(error);
        //TODO: Show message
      });
    };
    $scope.asOrfStep1 = function(){
      $scope.projectListFunc = $scope.asOrfStep2;
      Admin.listProjects().then(function(response){
        $scope.projectList = response.data;
      }, function(error){
        console.log(error);
        //TODO: Show message
      });
    };
    $scope.asOrfStep2 = function(projectId){
      Admin.listDatasets(projectId).then(function(response){
        $scope.datasetList = response.data;
      }, function(error){
        console.log(error);
        //TODO: Show message
      });
    };
    $scope.addDataset = function(projectId){
      Admin.addDataset(projectId, $scope.folderName).then(function(){
        $scope.folderName = '';
        $scope.projectList = '';
        $scope.datasetList = '';
      }, function(error){
        console.log(error);
        //TODO: Show message
      });
    };
    $scope.addOrf = function(datasetId){
      Admin.addOrf(datasetId, $scope.folderName).then(function(){
        $scope.folderName = '';
        $scope.projectList = '';
        $scope.datasetList = '';
      }, function(error){
        console.log(error);
        //TODO: Show message
      });
    };
    $scope.resetAdding =  function(){
      $scope.folderName = '';
      $scope.projectList = '';
      $scope.datasetList = '';
    };

    $scope.delete = function (user) {
      user.$remove();
      $scope.users.splice($scope.users.indexOf(user), 1);
      userTableSetting.data = $scope.users;
      $scope.userTableParams = new NgTableParams(userTableParameters, userTableSetting);
    };

    // Create new group
    $scope.addGroup = function(group){
      $http.post('/api/groups/', {name: group}).then(function(){
        ngToast.create({
          className: 'success',
          content: 'Group <b>'+group+'</b> created!',
          timeout: 3000
        });
      }, function(error){
        ngToast.create({
          className: 'danger',
          content: '<b>Error creating group... Names can not be duplicate.</b>',
          timeout: 5000
        });
      });
      $scope.newGroup = '';
    };

    $scope.removeGroup = function(groupId){
      $http.delete('/api/groups/' + groupId).then(function(){

      }, function(error){
        ngToast.create({
          className: 'danger',
          content: '<b>Error removing group: </b>' + error.statusText,
          timeout: 5000
        });
      });
    };

    $scope.updateData = function(){
      $scope.updating = true;
      $http.post('/api/data/update', {}).then(function(response){
        $timeout(function(){$scope.updating = false;}, 1000);

        ngToast.create({
          className: 'success',
          content: 'Database was updated successfully!',
          timeout: 3000
        });
      }, function(error){
        console.log(error);
        //TODO: Show message
      });
    };

    $http.get('/api/groups/').then(function(response){
      $scope.groups = response.data;
      console.log(response.data)
      socket.syncUpdates('group', $scope.groups);
    }, function(error){
      console.log(error);
      //TODO: Show message
    });

  });
})();
