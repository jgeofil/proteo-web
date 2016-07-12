'use strict';

angular.module('proteoWebApp')
  .config(function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        reloadOnSearch: false
      });
  });
