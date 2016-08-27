'use strict';

angular.module('proteoWebApp')
  .service('Group', function ($http) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    function respData (resp){return resp.data;}
    var base = '/api/groups/';

    this.addGroup = function(groupName){
      return $http.post(base, {name: groupName});
    };
    this.removeGroup = function(groupId){
      return $http.delete(base + groupId);
    };
    this.get = function(){
      return $http.get(base).then(respData);
    };
    this.getOne = function (groupId) {
      return $http.get(base+ groupId).then(respData);
    };
    this.addUserToGroup = function (groupId, userEmail) {
      return $http.patch(base + groupId + '/adduser', {email: userEmail});
    };
    this.removeUserFromGroup = function (groupId, userId) {
      return $http.patch(base + groupId + '/removeuser/'+ userId);
    };
    this.addPermissionToGroup = function (groupId, projectId) {
      return $http.patch(base + groupId + '/addset/'+ projectId);
    };
    this.removePermissionFromGroup = function (groupId, projectId) {
      return $http.patch(base + groupId + '/remove/'+ projectId);
    };
  });
