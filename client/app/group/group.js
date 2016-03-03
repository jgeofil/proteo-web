'use strict';

angular.module('proteoWebApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/group/:groupId', {
        templateUrl: 'app/group/group.html',
        controller: 'GroupCtrl',
        authenticate: 'admin'
      });
  });
