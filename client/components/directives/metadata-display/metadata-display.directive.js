'use strict';

angular.module('proteoWebApp')
  .directive('metadataDisplay', function () {
    return {
      templateUrl: 'components/directives/metadata-display/metadata-display.html',
      restrict: 'EA',
      scope: {
        mdMetadata: '='
      },
      link: function (scope, element, attrs) {

      }
    };
  });
