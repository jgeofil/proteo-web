'use strict';

angular.module('proteoWebApp')
  .directive('itasserAlignGraph', function () {
    return {
      templateUrl: 'components/graphing/itasserAlignGraph/itasserAlignGraph.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
