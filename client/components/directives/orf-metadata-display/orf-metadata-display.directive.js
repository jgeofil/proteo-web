'use strict';

angular.module('proteoWebApp')
  .directive('orfMetadataDisplay', function (d3Helper) {
    return {
      templateUrl: 'components/directives/orf-metadata-display/orf-metadata-display.html',
      restrict: 'EA',
      scope: {
        mdMetadata: '='
      },
      link: function (scope, element, attrs) {
        var width = 80;
        var height = 100;

        // Size and margins
        var svg = d3.select('#orf-solubility').append('svg')
          .attr('width', width)
          .attr('height', height)
          .append('g')
          .attr('transform', 'translate(45,10)');

        // Scales and domains
        var y = d3.scale.linear().range([height-20,0]);
        y.domain([0,1]);

        //**********************************************************************
        // Axes
        var yAxis = d3.svg.axis().scale(y).orient('left').ticks(3);

        svg.append('g')
          .attr('class', 'y axis')
          .call(yAxis);

        var gradient = svg.append('defs')
          .append('linearGradient')
            .attr('id', 'gradient2')
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '100%')
            .attr('y2', '100%')
            .attr('spreadMethod', 'pad');

        gradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', '#0c0')
            .attr('stop-opacity', 1);

        gradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', '#c00')
            .attr('stop-opacity', 1);

            svg.append("circle")
                         .attr("cx", 5)
                         .attr("cy", 10)
                         .attr("r", 2).style("fill", "red")
       svg.append('text')
         .attr('class', 'y label')
         .attr('text-anchor', 'middle')
         .attr('y', 13)
         .attr('x', 20)
         .text('0.83')
         .style("fill", "red")

        svg.append('text')
          .attr('class', 'y label')
          .attr('text-anchor', 'middle')
          .attr('y', -35)
          .attr('x', -(height-20)/2)
          .attr('transform', 'rotate(-90)')
          .text('solubility');

      }
    };
  });
