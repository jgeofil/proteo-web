'use strict';

//TODO: include D3 in a more Angular way
/* jshint undef: false*/

angular.module('proteoWebApp')
  .directive('primarySequenceGraph', function (d3Helper) {
    return {
      templateUrl: 'components/graphing/primarySequenceGraph/primarySequenceGraph.html',
      restrict: 'E',
      scope:{
        graphData: '='
      },
      link: function (scope, element, attrs) {
        scope.$watch('graphData', function(){
          if(scope.graphData.sequence.length > 0){
            //Length of the sequence alignement
            var seqln = scope.graphData.sequence[0].length;

            // Size and margins
            var si = d3Helper.getSizing(35, 25, 20, seqln);

            // Scales and domains
            var x = d3.scale.linear().range([0, si.width]);
            x.domain([1,seqln]);
            var step = x(0)-x(1);

            // Create SVG D3 container
            var svg = d3Helper.getSvgCanvas(element.children()[0],si);
            // Sub-containers
            var header = svg.append('g').attr('class', 'primary-sequence-header');
            var body = svg.append('g').attr('class', 'primary-sequence-body');

            //**********************************************************************
            // Axes
            var xAxis = d3.svg.axis().scale(x).orient('bottom');
            svg.append('g')
              .attr('class', 'x axis')
              .attr('transform', 'translate(0,' + (si.height) + ')')
              .call(xAxis);

            //**********************************************************************
            // Main sequence
            header.selectAll('text')
              .data(scope.graphData.sequence[0].split('')).enter()
              .append('text')
                .attr('class', 'itasser-sequence-amino')
                .attr('text-anchor', 'middle')
                .attr('x', function(d,i){return x(i+1);})
                .attr('y',  -15)
                .text(function(d){return d;});

          }
        });

      }
    };
  });
