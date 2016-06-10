'use strict';

angular.module('proteoWebApp')
  .directive('orfPanelTitle', function () {
    return {
      templateUrl: 'components/directives/orf-panel-title/orf-panel-title.html',
      restrict: 'EA',
      scope: {
        optTitle: '=',
        optState: '='
      },
      link: function (scope, element, attrs) {
      }
    };
  });
