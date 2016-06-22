'use strict';

angular.module('proteoWebApp')
  .directive('orfModelCarousel', function ($timeout) {
    return {
      templateUrl: 'components/directives/orf-model-carousel/orf-model-carousel.html',
      restrict: 'EA',
      scope: {
        omcModels: '='
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
          if(active === scope.omcModels.length-1){
            active = 0;
          }else{
            active += 1;
          }
        };

        //Decrement image index
        scope.left = function(){
          if(active === 0){
            active = scope.omcModels.length-1;
          }else{
            active -= 1;
          }
        };

        $timeout(function(){
          scope.omcModels.forEach(function(model){
            // Assume there exists an HTML div with id 'gldiv'
            var element = $('#omc-model-'+model.shortName);
            // Viewer config - properties 'defaultcolors' and 'callback'
            var config = {defaultcolors: $3Dmol.rasmolElementColors };
            // Create GLViewer within 'gldiv'
            var myviewer = $3Dmol.createViewer(element, config);
            //'data' is a string containing molecule data in pdb format
            myviewer.addModel(String(model.data), 'pdb');
            myviewer.setBackgroundColor(0xffffff);
            myviewer.setStyle({}, {cartoon: {color: 'spectrum'}});
            myviewer.zoomTo();
            myviewer.render();
          });

        });
      }
    };
  });
