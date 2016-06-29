'use strict';

angular.module('proteoWebApp')
  .directive('molecularModel', function ($timeout) {
    return {
      templateUrl: 'components/molecularModel/molecularModel.html',
      restrict: 'EA',
      scope:{
        mmPdb: '='
      },
      link: function (scope, element, attrs) {
        var me = $('#model-modal');
        var width = element.parent.offsetWidth;

        scope.style = 'cartoon';

        // Viewer config - properties 'defaultcolors' and 'callback'
        var config = {defaultcolors: $3Dmol.rasmolElementColors };
        // Create GLViewer within 'gldiv'
        var myviewer = $3Dmol.createViewer(me, config);
        //'data' is a string containing molecule data in pdb format
        var model = myviewer.addModel(String(scope.mmPdb), 'pdb');
        var h = myviewer.selectedAtoms({atom: [ '1H','2H','3H',
                                                '1HB','2HB','3HB',
                                                'HA','HB','H',
                                                '1HG','2HG','3HG',
                                                '1HE','2HE','3HE',
                                                'HE1','HE2','HE3',
                                                '1HD','2HD','3HD',
                                                'HD1','HD2','HD3',
                                                '1HZ','2HZ','3HZ',
                                                '1HD1','2HD1','3HD1',
                                                '1HD2','2HD2','3HD2',
                                                '1HD2','2HD2','3HD2',
                                                '1HG1','2HG1','3HG1',
                                                '1HG2','2HG2','3HG2',
                                                '1HG2','2HG2','3HG2',
                                                '3HD1']});
        console.log(h)
        model.removeAtoms(h);
        myviewer.setBackgroundColor(0xffffff);
        myviewer.setStyle({}, {cartoon: {color: 'spectrum'}});
        myviewer.setWidth(width);
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

        scope.viewer = myviewer;


      }
    };
  });
