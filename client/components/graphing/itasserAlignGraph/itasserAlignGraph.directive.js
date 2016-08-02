'use strict';

//TODO: include D3 in a more Angular way
/* jshint undef: false*/

angular.module('proteoWebApp')
  .directive('itasserAlignGraph', function (d3Helper) {
    return {
      templateUrl: 'components/graphing/itasserAlignGraph/itasserAlignGraph.html',
      restrict: 'E',
      scope:{
        graphData: '=',
        seqCount: '='
      },
      link: function (scope, element, attrs) {
        //Length of the sequence alignement
        var seqln = scope.graphData.sequence.length;
        var aligns = scope.graphData.data.other.alignments;

        //Keep only necessary alignments
        var data = aligns.slice(0, scope.seqCount);
        data.forEach(function(d){
          d.coverage = d.coverage.split(''); //Split alignement sequences
        });

        // Size and margins
        var si = d3Helper.getSizing(scope.seqCount*17, 25, 20, seqln);

        // Scales and domains
        var x = d3.scale.linear().range([0, si.width]);
        x.domain([1,seqln]);
        var step = x(0)-x(1);

        // Create SVG D3 container
        var svg = d3Helper.getSvgCanvas(element.children()[0],si);
        // Sub-containers
        var header = svg.append('g').attr('class', 'itasser-align-header');
        var body = svg.append('g').attr('class', 'itasser-align-body');

        //**********************************************************************
        // Axes
        var xAxis = d3.svg.axis().scale(x).orient('bottom');
        svg.append('g')
          .attr('class', 'x axis')
          .attr('transform', 'translate(0,' + (si.height) + ')')
          .call(xAxis);

        //**********************************************************************
        // Create tooltip function
        var tip = d3.tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0])
          .html(function(d) {
            return "<span style='color:white'> Z/Z0: " + d.zz0 + "<br>"+d.method+"</span>";
          });
        svg.call(tip);

        //**********************************************************************
        // Main sequence
        header.selectAll('text')
          .data(scope.graphData.sequence.split('')).enter()
          .append('text')
            .attr('class', 'itasser-sequence-amino')
            .attr('text-anchor', 'middle')
            .attr('x', function(d,i){return x(i+1);})
            .attr('y',  -15)
            .text(function(d){return d;});

        //**********************************************************************
        // Alignement sequences

        // Append sequence identifiers
        body.selectAll('g').data(data).enter()
          .append('text')
          .attr('class', 'itasser-align-info')
          .attr('text-anchor', 'start')
          .attr('x', -80)
          .attr('y', function(d,i){return i*12;})
          .text(function(d){return d.rank +' '+ d.pdbid;})
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide);

        // Create sequence containers
        var sequences = body.selectAll('g')
          .data(data).enter()
          .append('g')
          .attr('transform', function(d,i){return 'translate(0,' + i*12 + ')';});

        // Append sequences to containers
        sequences.selectAll('rect')
          .data(function(d){
            return d.coverage;
          }).enter().append('svg:rect')
          .attr('x', function(d,i) { return x(i)-(step/2); })
          .attr('y', -6)
          .attr('width', function(d,i) { return x(i)-x(i-1); })
          .attr('height', 8)
          .attr('class', function(d){
            switch(d){
              case '=':
                return 'itasser-align-equal';
              case '-':
                return 'itasser-align-dash';
              default:
                return 'itasser-align';
            }
          });
      }
    };
  });
