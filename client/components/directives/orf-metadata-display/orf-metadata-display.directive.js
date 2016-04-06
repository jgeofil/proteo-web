'use strict';
/* jshint undef: false*/
angular.module('proteoWebApp')
  .directive('orfMetadataDisplay', function (d3Helper) {
    return {
      templateUrl: 'components/directives/orf-metadata-display/orf-metadata-display.html',
      restrict: 'EA',
      scope: {
        mdMetadata: '='
      },
      link: function (scope, element, attrs) {

        // Size and margins
        var width = 120;
        var height = 70;
        var svg = d3.select('#orf-solubility').append('svg')
          .attr('width', width)
          .attr('height', height)
          .append('g')
          .attr('transform', 'translate(10,0)');

        //**********************************************************************
        // Scales and domains
        var y = d3.scale.linear().range([0,width-20]);
        y.domain([0,1]);

        // Axes
        var yAxis = d3.svg.axis().scale(y).orient('bottom').ticks(3);
        svg.append('g')
          .attr('class', 'y axis')
          .call(yAxis)
          .attr('transform', 'translate(0,20)');

        //**********************************************************************
        // Value circle and label
        svg.append('text')
          .attr('class', 'y label')
          .attr('text-anchor', 'middle')
          .attr('y', 10)
          .attr('x', (width-20)/2)
          .attr('id', 'unset-label')
          .text('Unset')
          .style('fill', 'red');

        scope.$watch('mdMetadata.solubility',function(newValue, oldValue){
          if(newValue !== oldValue){
            d3.select('#unset-label').remove();
            svg.append('circle')
              .attr('cx', y(scope.mdMetadata.solubility))
              .attr('cy', 15)
              .attr('r', 2)
              .style('fill', 'red');

            svg.append('text')
              .attr('class', 'y label')
              .attr('text-anchor', 'middle')
              .attr('y', 10)
              .attr('x', y(scope.mdMetadata.solubility))
              .text(scope.mdMetadata.solubility)
              .style('fill', 'red');
          }
        });

        // Value label
        svg.append('text')
          .attr('class', 'y label')
          .attr('text-anchor', 'middle')
          .attr('y', 55)
          .attr('x', (width-20)/2)
          .text('solubility');
    }};
  });
