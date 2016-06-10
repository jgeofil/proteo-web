'use strict';

angular.module('proteoWebApp')
  .directive('fileDownloadButton', function (Download) {
    return {
      templateUrl: 'components/directives/file-download-button/file-download-button.html',
      restrict: 'EA',
      scope: {
        fdbFiles: '=',
        fdbAnalysisPath: '='
      },
      link: function (scope, element, attrs) {
        scope.downUrl = Download.triggerDownloadFromUrl;

        scope.pathToFile = function(p, n){
          return p + '/file/'+ n;
        };
      }
    };
  });
