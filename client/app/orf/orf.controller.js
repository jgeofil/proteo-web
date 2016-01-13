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
        //'title' : false,
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

    //**************************************************************************
    // ITASSER
    //**************************************************************************
    $http.get('/api/data/' + $routeParams.datasetName + '/orf/' +
      $routeParams.orfName + '/analysis/itasser/models')
    .then(function(data){
      $scope.itasserModels = data.data;

      $scope.itasserModels.forEach(function(model){
        $http.get('/api/data/' + $routeParams.datasetName + '/orf/' +
          $routeParams.orfName + '/analysis/itasser/models/'+model)
        .then(function(data){

          // Assume there exists an HTML div with id "gldiv"
          var element = $('#gldiv-'+model);

          // Viewer config - properties 'defaultcolors' and 'callback'
          var config = {defaultcolors: $3Dmol.rasmolElementColors };
          // Create GLViewer within 'gldiv'
          var myviewer = $3Dmol.createViewer(element, config);
          //'data' is a string containing molecule data in pdb format
          myviewer.addModel(String(data.data), 'pdb');
          myviewer.setBackgroundColor(0xffffff);
          myviewer.setStyle({}, {stick:{}});
          myviewer.zoomTo();
          myviewer.render();
        });
      });

    });
  });
