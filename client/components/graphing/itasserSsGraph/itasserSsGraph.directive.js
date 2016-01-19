'use strict';
//TODO: include D3 in a more Angular way
/* jshint undef: false*/
angular.module('proteoWebApp')
  .directive('itasserSsGraph', function () {
    return {
      templateUrl: 'components/graphing/itasserSsGraph/itasserSsGraph.html',
      restrict: 'E',
      scope:{
        graphDataSs: '=',
        graphHeight: '='
      },
      link: function (scope, element, attrs) {
        console.log(scope.graphDataSs)

        var margin = {top: 20, right: 20, bottom: 50, left: 60},
          width = element.parent().width() - margin.left - margin.right,
          height = scope.graphHeight - margin.top - margin.bottom;

        var x = d3.scale.linear()
          .range([0, width]);

        var xAxis = d3.svg.axis()
          .scale(x)
          .orient('bottom');

        var yCon = d3.scale.linear()
          .range([height-20,height-70]);

        var yConAxis = d3.svg.axis()
          .scale(yCon)
          .orient('left')
          .ticks(3);

        var conLine = d3.svg.line()
          .x(function(d) { return x(d.pos); })
          .y(function(d) { return yCon(Math.max(d.confidence.coil,d.confidence.beta,d.confidence.helix)); });

        var tip = d3.tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0])
          .html(function(d) {
            return "<span style='color:red'>" + d.amino + "</span>";
          });



        var svg = d3.select('#itasser-ss-graph').append('svg')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        svg.call(tip);

        x.domain(d3.extent(scope.graphDataSs, function(d) { return d.pos; }));
        yCon.domain([0,1]);

        svg.append('svg:line')
          .attr('x1', 0)
          .attr('x2', width)
          .attr('y1', height -10)
          .attr('y2', height -10)
          .style('stroke', 'black')
          .style('stroke-width', 1)  ;

        var step = x(0)-x(1);

        svg.selectAll('rect')
          .data(scope.graphDataSs)
          .enter().append('svg:rect')
          .attr('x', function(d) { return x(d.pos)-(step/2); })
          .attr('y', height -15)
          .attr('width', function(d) { return x(d.pos+1)-x(d.pos); })
          .attr('height', 10)
          .style('fill', function(d){
            switch(d.symbol){
              case 'H':
                return 'red';
              case 'S':
                return 'blue';
              case 'E':
                return 'yellow';
              default:
                return 'none';
            }
          })
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide);

        svg.append('g')
          .attr('class', 'x axis')
          .attr('transform', 'translate(0,' + height + ')')
          .call(xAxis);

        svg.append('text')
          .attr('class', 'x label')
          .attr('text-anchor', 'middle')
          .attr('x', width/2)
          .attr('y', height + 35)
          .text('position');

          svg.append('g')
            .attr('class', 'y axis')
            .call(yConAxis);

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
            .attr('x', -50)
            .attr('transform', 'rotate(-90)')
            .text('confidence');

          svg.append('path')
            .attr('class', 'line')
            .attr('d', conLine(scope.graphDataSs))
            .style('stroke-width', 1)    // set the stroke width
            .style('stroke', 'red') ;

      }
    };
  });
