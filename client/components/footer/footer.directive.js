'use strict';

angular.module('proteoWebApp')
  .directive('footer', function (version) {
    return {
      templateUrl: 'components/footer/footer.html',
      restrict: 'E',
      link: function(scope, element) {
        element.addClass('footer');
        scope.version = version.getVersion();
      }
    };
  });
