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
        //Current active image index
        var active = 0;

        //Returns current index
        scope.current = function(){
          return active;
        };

        //Increment image index
        scope.right = function(){
          if(active === scope.oicImages.length-1){
            active = 0;
          }else{
            active += 1;
          }
        };

        //Decrement image index
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
