'use strict';
//TODO: include D3 in a more Angular way
/* jshint undef: false*/
angular.module('proteoWebApp')
  .directive('disodisoGraphLine', function () {
    return {
      templateUrl: 'components/graphing/disoGraphLine/disoGraphLine.html',
      restrict: 'E',
      scope:{
        graphData: '=',
        graphHeight: '='
      },
      link: function (scope, element, attrs) {

        var margin = {top: 20, right: 20, bottom: 50, left: 60},
          width = element.parent().width() - margin.left - margin.right,
          height = scope.graphHeight - margin.top - margin.bottom;

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

        x.domain(d3.extent(scope.graphData, function(d) { return d.pos; }));
        y.domain([0,1]);
        //y.domain(d3.extent(scope.graphData, function(d) { return d.diso.value===null?0:d.diso.value; }));

        svg.append('rect')
         .attr('x', 0)
         .attr('y', y(0.5))
         .attr('width', width)
         .attr('height', y(0)-y(0.5))
         .style('fill', '#EEE');

        svg.append('g')
          .attr('class', 'x axis')
          .attr('transform', 'translate(0,' + height + ')')
          .call(xAxis);

        svg.append('g')
          .attr('class', 'y axis')
          .call(yAxis);

        svg.append('text')
          .attr('class', 'x label')
          .attr('text-anchor', 'middle')
          .attr('x', width/2)
          .attr('y', height + 35)
          .text('position');

        svg.append('text')
          .attr('class', 'y label')
          .attr('text-anchor', 'middle')
          .attr('y', -40)
          .attr('x', -height/2)
          .attr('transform', 'rotate(-90)')
          .text('probability score');

        svg.append('path')
          .attr('class', 'line')
          .attr('d', line(scope.graphData))
          .style('stroke-width', 1)    // set the stroke width
          .style('stroke', 'red') ;

      }
    };
  });
