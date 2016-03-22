'use strict';

angular.module('proteoWebApp')
  .directive('molecularModel', function () {
    return {
      templateUrl: 'components/molecularModel/molecularModel.html',
      restrict: 'EA',
      scope:{
        mmPdb: '='
      },
      link: function (scope, element, attrs) {
        var me = $('#model-modal');

        scope.style = 'cartoon';

        // Viewer config - properties 'defaultcolors' and 'callback'
        var config = {defaultcolors: $3Dmol.rasmolElementColors };
        // Create GLViewer within 'gldiv'
        var myviewer = $3Dmol.createViewer(me, config);
        //'data' is a string containing molecule data in pdb format
        var model = myviewer.addModel(String(scope.mmPdb), 'pdb');
        var h = model.selectedAtoms({atom: 'HA'});
        model.removeAtoms(h);
        myviewer.setBackgroundColor(0xffffff);
        myviewer.setStyle({}, {cartoon: {color: 'spectrum'}});
        myviewer.zoomTo();
        myviewer.render();

        scope.$watch('style', function() {
          switch(scope.style){
            case 'stick':
              myviewer.setStyle({}, {stick: {color: 'spectrum'}});
              break;
            case 'cartoon':
              myviewer.setStyle({}, {cartoon: {color: 'spectrum'}});
              break;
            case 'sphere':
              myviewer.setStyle({}, {sphere: {color: 'spectrum'}});
              break;
          }
          myviewer.render();
        });

      }
    };
  });
