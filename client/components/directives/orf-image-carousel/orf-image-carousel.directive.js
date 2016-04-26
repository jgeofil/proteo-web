'use strict';

angular.module('proteoWebApp')
  .directive('orfImageCarousel', function () {
    return {
      templateUrl: 'components/directives/orf-image-carousel/orf-image-carousel.html',
      restrict: 'EA',
      scope: {
        oicImages: '='
      },
      link: function (scope, element, attrs) {
        var active = 0;

        scope.current = function(){
          return active;
        };

        scope.right = function(){
          if(active === scope.oicImages.length-1){
            active = 0;
          }else{
            active += 1;
          }
        };

        scope.left = function(){
          if(active === 0){
            active = scope.oicImages.length-1;
          }else{
            active -= 1;
          }
        };


      }
    };
  });
