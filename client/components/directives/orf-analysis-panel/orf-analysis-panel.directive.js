'use strict';

angular.module('proteoWebApp')
  .directive('orfAnalysisPanel', function () {
    return {
      templateUrl: 'components/directives/orf-analysis-panel/orf-analysis-panel.html',
      transclude: true,
      restrict: 'EA',
      scope: {
        oapAnalysis: '=',
        oapTitle: '=',
        oapIsOpen: '=',
        oapIsPresent: '=',
        oapConfig: '=',
        oapScroll: '=',
        oapMetadata: '='
      },
      link: function (scope, element, attrs) {
        //**********************************************************************
        // State

        scope.toggleOpen = function (){scope.oapIsOpen = !scope.oapIsOpen;};
        scope.infoOpen = false;
        scope.toggleInfo = function (){scope.infoOpen = !scope.infoOpen;};

        //**********************************************************************
        // Scroll control

        var scrollZone = $(element[0].getElementsByClassName('orf-scroll')[0]);

        scope.$watch('oapScroll', function(){
          if(scrollZone.scrollLeft() !== scope.oapScroll){
            scrollZone.scrollLeft(scope.oapScroll);
          }
        });
        scrollZone.scroll(function(){
          scope.oapScroll = scrollZone.scrollLeft();
          scope.$apply();
        });

      }
    };
  });
