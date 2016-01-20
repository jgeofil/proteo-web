'use strict';

angular.module('proteoWebApp')
  .directive('itasserAlignGraph', function () {
    return {
      templateUrl: 'components/graphing/itasserAlignGraph/itasserAlignGraph.html',
      restrict: 'E',
      scope:{
        graphData: '=',
        graphHeight: '='
      },
      link: function (scope, element, attrs) {
      }
    };
  });
