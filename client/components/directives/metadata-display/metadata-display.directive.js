'use strict';

angular.module('proteoWebApp')
  .directive('metadataDisplay', function ($compile) {
    return {
      templateUrl: 'components/directives/metadata-display/metadata-display.html',
      restrict: 'EA',
      scope: {
        mdMetadata: '=',
        mdIsOpen: '='
      },
      link: function (scope, element, attrs) {

        var el2 = element.children()[0];
        element.before( el2 );
      }
    };
  });
