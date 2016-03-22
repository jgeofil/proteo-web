'use strict';
//TODO: include D3 in a more Angular way
/* jshint undef: false*/
angular.module('proteoWebApp')
  .directive('itasserSsGraph', function () {
    return {
      templateUrl: 'components/graphing/itasserSsGraph/itasserSsGraph.html',
      restrict: 'E',
      scope:{
        graphDataSs: '='
      },
      link: function (scope, element, attrs) {
        var seqln = scope.graphDataSs.length; //Length of the sequence alignement

        var margin = {top: 10, right: 20, bottom: 35, left: 90};
        var width = (seqln*10) - margin.left - margin.right;
        var height = 120 - margin.top - margin.bottom;

        var x = d3.scale.linear()
          .range([0, width]);

        var xAxis = d3.svg.axis()
          .scale(x)
          .orient('bottom');

        var yCon = d3.scale.linear()
          .range([height-20,0]);

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
            return "<span style='color:white'>" + d.amino +"-"+ d.pos+ "</span>";
          });

        var svg = d3.select('#itasser-ss-graph').append('svg')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        svg.on('.zoom', null);

        svg.call(tip);

        x.domain(d3.extent(scope.graphDataSs, function(d) { return d.pos; }));
        yCon.domain([0,1]);

        svg.append('svg:line')
          .attr('x1', 0)
          .attr('x2', width)
          .attr('y1', height -10)
          .attr('y2', height -10)
          .style('stroke', 'black')
          .style('stroke-width', 1);

        var step = x(0)-x(1);

        svg.selectAll('rect')
          .data(scope.graphDataSs)
          .enter().append('svg:rect')
          .attr('x', function(d) { return x(d.pos-1)-(step/2); })
          .attr('y', height -15)
          .attr('width', function(d) { return x(d.pos)-x(d.pos-1); })
          .attr('height', 10)
          .attr('class', function(d){
            switch(d.symbol){
              case 'H':
                return 'itasser-helix';
              case 'E':
                return 'itasser-beta';
              default:
                return 'itasser-coil';
            }
          })
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide);

        svg.append('g')
          .attr('class', 'x axis')
          .attr('transform', 'translate(0,' + height + ')')
          .call(xAxis);

          svg.append('g')
            .attr('class', 'y axis')
            .call(yConAxis);

          svg.append('text')
            .attr('class', 'y label')
            .attr('text-anchor', 'middle')
            .attr('y', -40)
            .attr('x', 10-height/2)
            .attr('transform', 'rotate(-90)')
            .text('confidence');

          svg.append('path')
            .attr('class', 'itasser-con-line')
            .attr('d', conLine(scope.graphDataSs))
            .style('stroke-width', 1)    // set the stroke width
            .style('stroke', 'red') ;

          var legend = svg.append('g')
        	  .attr('class', 'legend')
        	  .attr('x', 20)
        	  .attr('y', height+25)
        	  .attr('height', 100)
        	  .attr('width', 100);

        	legend.selectAll('g')
            .data([
              {
                name: 'Helix',
                color: 'red'
              },
              {
                name: 'Beta',
                color: 'blue'
              },
            ])
            .enter()
            .append('g')
            .each(function(d, i) {
              var g = d3.select(this);
              g.append('rect')
                .attr('x', 20+100*i)
                .attr('y', height+25)
                .attr('width', 10)
                .attr('height', 10)
                .style('fill', d.color);

              g.append('text')
                .attr('x', 20+100*i+15)
                .attr('y', height+35)
                .attr('height',30)
                .attr('width',100)
                .style('fill', d.color)
                .text(d.name);

            });

      }
    };
  });
