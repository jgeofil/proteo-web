'use strict';

(function() {

angular.module('proteoWebApp.admin')
  .controller('AdminController', function(User, Admin, $scope, $http, $timeout,
    socket, NgTableParams, ngToast, Group, Datatree, Popup){

    $scope.groups = [];
    $scope.newGroup = '';
    $scope.users = [];
    $scope.userTableParams = {};
    $scope.folderList = [];
    $scope.projectList = undefined;
    $scope.datasetList = undefined;
    $scope.asProject = false;
    $scope.asDataset = false;
    $scope.asOrf = false;
    $scope.updating = false;
    $scope.folderName = '';
    $scope.addLoading = false;
    $scope.addProject = Admin.addProject;

    var userTableParameters = {page: 1, count: 10, filter: {name:''}};
    var userTableSetting = {};

    function setLoading (){ $scope.addLoading = true;}
    function setDone (){ $scope.addLoading = false;}
    function logError (error){ console.log(error);}
    function getProjectsList (){
      Admin.listProjects()
        .then(function(response){
          $scope.projectList = response.data;
        }).catch(logError);
    }

    User.query().$promise
      .then(function (result) {
        $scope.users = result;
        userTableSetting.data = $scope.users;
        $scope.userTableParams = new NgTableParams(userTableParameters, userTableSetting);
      });

    Admin.getListOfFolders()
      .then(function(data){
        $scope.folderList = data;
      }).catch(logError);

    Group.get().then(function(data){
      $scope.groups = data;
      socket.syncUpdates('group', $scope.groups);
    }).catch(logError);

    $scope.resetAdding =  function(){
      $scope.folderName = '';
      $scope.projectList = undefined;
      $scope.datasetList = undefined;
      $scope.asProject = false;
      $scope.asDataset = false;
      $scope.asOrf = false;
      $scope.addLoading = false;
    };

    $scope.setFolderName = function(name){
      $scope.folderName = name;
    };

    $scope.addProject = function(){
      $scope.asProject = true;
      setLoading();
      Admin.addProject($scope.folderName)
        .catch(Popup.failure('Error adding project.'))
        .finally($scope.resetAdding);
    };

    $scope.projectSelected = function(projectId){
      if($scope.asDataset){
        setLoading();
        Admin.addDataset(projectId, $scope.folderName)
          .catch(Popup.failure('Error adding Dataset.'))
          .finally($scope.resetAdding);
      }else if($scope.asOrf){
        setLoading();
        Admin.listDatasets(projectId)
          .then(function(data){
            $scope.datasetList = data;
          })
          .catch(logError)
          .finally(setDone);
      }
    };

    $scope.addAsDataset = function(){
      $scope.asDataset = true;
      getProjectsList();
    };

    $scope.addAsOrf = function(){
      $scope.asOrf = true;
      getProjectsList();
    };

    $scope.addOrf = function(datasetId){
      setLoading();
      Admin.addOrf(datasetId, $scope.folderName)
        .catch(Popup.failure('Error adding ORF.'))
        .finally($scope.resetAdding);
    };

    $scope.delete = function (user) {
      user.$remove();
      $scope.users.splice($scope.users.indexOf(user), 1);
      userTableSetting.data = $scope.users;
      $scope.userTableParams = new NgTableParams(userTableParameters, userTableSetting);
    };

    $scope.addGroup = function(group){
      Group.addGroup(group)
        .then(Popup.success('Group <b>'+group+'</b> created!'))
        .catch(Popup.failure('<b>Error creating group... Names can not be duplicate.</b>'));
      $scope.newGroup = '';
    };

    $scope.removeGroup = function(groupId){
      Group.removeGroup(groupId)
        .catch(Popup.failure('<b>Error removing group</b>'));
    };

    $scope.updateData = function(){
      $scope.updating = true;
      Datatree.removeAllData()
        .then(function(){
          $timeout(function(){$scope.updating = false;}, 1000);
          Popup.success('Database was updated successfully!')();
        }).catch(logError);
    };
  });
})();
