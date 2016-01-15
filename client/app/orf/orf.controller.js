'use strict';
//TODO: include D3 in a more Angular way
/* jshint undef: false*/
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

      data.data.data.forEach(function(d){
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

      var margin = {top: 20, right: 20, bottom: 30, left: 50},
          width = 600 - margin.left - margin.right,
          height = 200 - margin.top - margin.bottom;

      var x = d3.scale.linear()
          .range([0, width]);

      var y = d3.scale.linear()
          .range([height,0]);

      var xAxis = d3.svg.axis()
          .scale(x)
          .orient('bottom');

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient('left')
          .ticks(5);


      var line = d3.svg.line()
          .x(function(d) { return x(d.pos); })
          .y(function(d) { return y(d.diso.value); });

      var svg = d3.select('#diso-graph').append('svg')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
        .append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      x.domain(d3.extent(data.data.data, function(d) { return d.pos; }));
      y.domain(d3.extent(data.data.data, function(d) { return d.diso.value===null?0:d.diso.value; }));

      svg.append('g')
          .attr('class', 'x axis')
          .attr('transform', 'translate(0,' + height + ')')
          .call(xAxis);

      svg.append('g')
          .attr('class', 'y axis')
          .call(yAxis);

      svg.append('path')
          .attr('class', 'line')
          .attr('d', line(data.data.data));
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
          myviewer.setStyle({}, {cartoon: {color: 'spectrum'}});
          myviewer.zoomTo();
          myviewer.render();
        });
      });

    });
  });
