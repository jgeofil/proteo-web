'use strict';
//TODO: include D3 in a more Angular way
/* jshint undef: false*/
angular.module('proteoWebApp')
  .directive('disoGraphLine', function () {
    return {
      templateUrl: 'components/graphing/disoGraphLine/disoGraphLine.html',
      restrict: 'E',
      scope:{
        graphData: '='
      },
      link: function (scope, element, attrs) {
        var seqln = scope.graphData.length; //Length of the sequence alignement

        var margin = {top: 10, right: 20, bottom: 25, left: 90};
        var width = (seqln*15) - margin.left - margin.right;
        var height = 100 - margin.top - margin.bottom;

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
          .ticks(3);

        var line = d3.svg.line()
          .x(function(d) { return x(d.pos); })
          .y(function(d) { return y(d.diso.value); });

        var bindLine = d3.svg.line()
          .x(function(d) { return x(d.pos); })
          .y(function(d) { return y(d.bind.value); });

        var svg = d3.select('#diso-graph').append('svg')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        x.domain(d3.extent(scope.graphData, function(d) { return d.pos; }));
        y.domain([0,1]);

        svg.append('rect')
         .attr('x', 0)
         .attr('y', y(0.5))
         .attr('width', width)
         .attr('height', y(0)-y(0.5))
         .style('fill', 'rgba(0, 0, 0, 0.03)');

       var focus = svg.append('g')
         .style('display', 'none');

        svg.append('g')
          .attr('class', 'x axis')
          .attr('transform', 'translate(0,' + height + ')')
          .call(xAxis);

        svg.append('g')
          .attr('class', 'y axis')
          .call(yAxis);

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

        svg.append('path')
          .attr('class', 'line')
          .attr('d', bindLine(scope.graphData))
          .style('stroke-width', 1)    // set the stroke width
          .style('stroke', 'blue') ;


        var tip = d3.tip()
          .attr('class', 'd3-tip')
          .offset([0, 0])
          .direction('e')
          .html(function(d) {
            return "<span style='color:white'>" +"-"+ "</span>";
          });
        svg.call(tip);

        // append the circle at the intersection
        focus.append('line')
          .attr('class', 'tip')
          .attr('x1', x(1))
          .attr('x2', x(1))
          .attr('y1', y(0))
          .attr('y2', y(0.9))
          .style('fill', 'none')
          .style('stroke-dasharray', ('3, 3'))
          .style('stroke', 'black')
          .style('stroke-width', '1');

        focus.append('rect')
          .attr('class', 'diso-tip')
          .attr('x', -10)
          .attr('y', -10)
          .attr('rx', 2)
          .attr('ry', 2)
          .attr('width', 20)
          .attr('height', 20);

        focus.append('text')
          .attr('class', 'diso-tip-text')
          .attr('x', -0)
          .attr('y', 0)
          .attr('dy', 5)
          .text('A');

        focus.append('circle')
            .attr('class', 'diso')
            .style('fill', 'none')
            .style('stroke', 'red')
            .attr('r', 2);

        focus.append('circle')
            .attr('class', 'bind')
            .style('fill', 'none')
            .style('stroke', 'blue')
            .attr('r', 2);

        var bisect = d3.bisector(function(d) { return d.pos; }).left;

        var mousemove = function() {
            var x0 = x.invert(d3.mouse(this)[0]),
                i = bisect(scope.graphData, x0, 1),
                d0 = scope.graphData[i - 1],
                d1 = scope.graphData[i],
                d = x0 - d0.pos > d1.pos - x0 ? d1 : d0;
            //TODO: this is unecessarily complicated, positions are integers

            focus.select('circle.diso')
                .attr('transform',
                      'translate(' + x(d.pos) + ',' +
                                     y(d.diso.value) + ')');
          focus.select('circle.bind')
            .attr('transform','translate(' + x(d.pos) + ',' + y(d.bind.value) + ')');

          focus.select('rect.diso-tip')
            .attr('transform', 'translate(' + x(d.pos) + ')');

          focus.select('text.diso-tip-text')
            .text(d.amino)
            .attr('transform', 'translate(' + x(d.pos) + ')');

          focus.select('line.tip')
            .attr('transform', 'translate(' + x(d.pos) + ')');
        };
        // append the rectangle to capture mouse
        svg.append('rect')
            .attr('width', width)
            .attr('height', height)
            .style('fill', 'none')
            .style('pointer-events', 'all')
            .on('mouseover', function() { focus.style('display', null);})
            .on('mouseout', function() { focus.style('display', 'none');})
            .on('mousemove', mousemove);

      }
    };
  });
