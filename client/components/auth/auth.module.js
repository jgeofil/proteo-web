'use strict';

angular.module('proteoWebApp.auth', [
  'proteoWebApp.constants',
  'proteoWebApp.util',
  'ngCookies',
  'ngRoute'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
