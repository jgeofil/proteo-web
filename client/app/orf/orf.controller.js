'use strict';

angular.module('proteoWebApp')
  .controller('OrfCtrl', function ($scope, $http, $routeParams) {

    //**************************************************************************
    // DISOPRED3
    //**************************************************************************
    $http.get('/api/data/' + $routeParams.datasetName + '/orf/' +
      $routeParams.orfName + '/analysis/disopred3')
    .then(function(data){

      //Protein sequence
      var diso3seq = new Sequence(data.data.seq);
      diso3seq.render('#sequence-viewer', {
        'showLineNumbers': true,
        'wrapAminoAcids': true,
        'charsPerLine': 200,
        'toolbar': false,
        'search': false,
        'title' : 'DISOPRED3',
        //'sequenceMaxHeight': '300px',
        'badge': false
      });

      //Display disodered regions
      data.data.symbol.forEach(function(sym, i){
        if(sym === '*'){
          diso3seq.selection(i, i+1, 'red');
        }
      });
      // Add legend
      var exempleLegend = [
        {name: 'Disordered', color: 'red', underscore: false},
      ];
      diso3seq.addLegend(exempleLegend);

    });
  });
