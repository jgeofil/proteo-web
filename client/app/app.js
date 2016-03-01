'use strict';

angular.module('proteoWebApp', [
  'proteoWebApp.auth',
  'proteoWebApp.admin',
  'proteoWebApp.constants',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'btford.socket-io',
  'validation.match',
  'ui.bootstrap',
  'ngAnimate',
  'ngScrollable',
  'ngTable'
])
  .config(function($routeProvider, $locationProvider) {
    $routeProvider
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);

  });
