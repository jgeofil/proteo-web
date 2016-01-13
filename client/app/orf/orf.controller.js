'use strict';

angular.module('proteoWebApp')
  .controller('OrfCtrl', function ($scope, $http, $routeParams) {

    //**************************************************************************
    // DISOPRED3
    //**************************************************************************
    $http.get('/api/data/' + $routeParams.datasetName + '/orf/' +
      $routeParams.orfName + '/analysis/disopred3')
    .then(function(data){

      console.log(data.data)
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

      var coverage = [];

      data.data.bind.symbol.forEach(function(sym, i){
        var style = {start: i, end: i+1, color: 'black', underscore: false};
        if(sym === '^'){
          style.underscore = true;
        }
        if(data.data.diso.symbol[i] === '*'){
          style.color = 'red';
        }
        coverage.push(style);
      });
      diso3seq.coverage(coverage);

      // Add legend
      var exempleLegend = [
        {name: 'Disordered', color: 'red', underscore: false},
        {name: 'Protein binding', color: 'white', underscore: true},
      ];
      diso3seq.addLegend(exempleLegend);

    });
  });
