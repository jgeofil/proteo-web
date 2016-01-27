'use strict';
//TODO: include D3 in a more Angular way
/* jshint undef: false*/
angular.module('proteoWebApp')
.controller('OrfCtrl', function ($scope, $http, $routeParams, $rootScope) {

  //**************************************************************************
  // Scrolling controls
  //**************************************************************************

  $scope.posX = 0;

  $scope.moveX = function (pixels) {
    $scope.posX = $scope.posX + pixels;
  };
  //$scope.$evalAsync(function () {
  //  $scope.$broadcast('content.changed', 1000);
//  });

  //**************************************************************************
  // DISOPRED3
  //**************************************************************************
  $http.get('/api/data/' + $routeParams.datasetName + '/orf/' +
  $routeParams.orfName + '/analysis/disopred3')
  .then(function(data){
    var inDat = data.data.data;
    $scope.disoGraphData = inDat;
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

    inDat.forEach(function(d){
      var style = {start: d.pos-1, end: d.pos, color: 'black', underscore: false};
      if(d.bind.symbol === '^'){
        style.underscore = true;
      }
      if(d.diso.symbol === '*'){
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
      $routeParams.orfName + '/analysis/itasser/models/'+model.name)
      .then(function(data){

        // Assume there exists an HTML div with id 'gldiv'
        var element = $('#gldiv-'+model.name);

        // Viewer config - properties 'defaultcolors' and 'callback'
        var config = {defaultcolors: $3Dmol.rasmolElementColors };
        // Create GLViewer within 'gldiv'
        var myviewer = $3Dmol.createViewer(element, config);
        //'data' is a string containing molecule data in pdb format
        myviewer.addModel(String(data.data), 'pdb');
        myviewer.setBackgroundColor(0xffffff);
        myviewer.setStyle({}, {cartoon: {color: 'spectrum'}});
        myviewer.zoomTo();
        myviewer.render();
      });
    });

  });

  $http.get('/api/data/' + $routeParams.datasetName + '/orf/' +
  $routeParams.orfName + '/analysis/itasser/predictions')
  .then(function(response){
    $scope.itasserSsGraphData = response.data;

    $scope.itasserAlignGraphData = response.data.align;

  });
});
