'use strict';

//TODO: include D3 in a more Angular way
/* jshint undef: false*/

angular.module('proteoWebApp')
  .directive('itasserAlignGraph', function () {
    return {
      templateUrl: 'components/graphing/itasserAlignGraph/itasserAlignGraph.html',
      restrict: 'E',
      scope:{
        graphData: '=',
        seqCount: '=' //Number of sequences to display
      },
      link: function (scope, element, attrs) {
        var seqln = scope.graphData.seq.length; //Length of the sequence alignement
        var data = scope.graphData.coverage.slice(0, scope.seqCount); //Keep only necessary alignements
        data.forEach(function(d){
          d.cov = d.cov.split(''); //Split alignement sequences
        });

        var margin = {top: 50, right: 20, bottom: 70, left: 90};
        var width = (seqln*15) - margin.right - margin.left;
        var height = (scope.seqCount*18);

        var x = d3.scale.linear().range([0, width]);
        var xAxis = d3.svg.axis().scale(x).orient('bottom');
        x.domain([1,seqln]);

        // Create SVG D3 container
        var svg = d3.select('#itasser-align-graph').append('svg')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        var header = svg.append('g')
          .attr('class', 'itasser-align-header');
        var body = svg.append('g')
          .attr('class', 'itasser-align-body');

        // Create tooltip function
        var tip = d3.tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0])
          .html(function(d) {
            return "<span style='color:white'> Z/Z0: " + d.zz0 + "</span>";
          });
        svg.call(tip);

        header.selectAll('text')
          .data(scope.graphData.seq.split('')).enter()
          .append('text')
            .attr('class', 'itasser-sequence-amino')
            .attr('text-anchor', 'middle')
            .attr('x', function(d,i){return x(i+1);})
            .attr('y',  -25)
            .text(function(d){return d;});

        // Append sequence identifiers
        body.selectAll('g').data(data).enter()
          .append('text')
          .attr('class', 'itasser-align-info')
          .attr('text-anchor', 'start')
          .attr('x', -80)
          .attr('y', function(d,i){return i*20;})
          .text(function(d){return d.rank +' '+ d.pdbid;})
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide);

        // Create sequence containers
        var sequences = body.selectAll('g')
          .data(data).enter()
          .append('g')
          .attr('transform', function(d,i){return 'translate(0,' + (i*20) + ')';});

        // Append sequences to containers
        sequences.selectAll('g')
          .data(function(d){
            return d.cov;
          }).enter()
          .append('text')
            .attr('class', 'itasser-sequence-amino')
            .attr('text-anchor', 'middle')
            .attr('x', function(d,i){return x(i+1);})
            .attr('y',  0)
            .text(function(d){return d;});

        // Draw x axis line
        svg.append('g')
          .attr('class', 'x axis')
          .attr('transform', 'translate(0,' + (height+5) + ')')
          .call(xAxis);


      }
    };
  });
