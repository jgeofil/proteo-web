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
  'ngTable',
  'angularSpinner',
  'ngToast',
  'angulartics', 'angulartics.google.analytics',
  'angucomplete-alt',
  'ngFileSaver',
  'ngMaterial'
])
  .config(function($routeProvider, $locationProvider, $mdThemingProvider) {
    $routeProvider
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);

    $mdThemingProvider.theme('default')
      .primaryPalette('indigo')
      .accentPalette('blue');

  });
