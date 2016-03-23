'use strict';
//TODO: include D3 in a more Angular way
/* jshint undef: false*/
angular.module('proteoWebApp')
  .directive('disoGraphLine', function (d3Helper) {
    return {
      templateUrl: 'components/graphing/disoGraphLine/disoGraphLine.html',
      restrict: 'E',
      scope:{
        graphData: '='
      },
      link: function (scope, element, attrs) {
        var seqln = scope.graphData.length; //Length of the sequence alignement

        // Size and margins
        var si = d3Helper.getSizing(100, 10, 25, seqln);

        //Scales and domains
        var x = d3.scale.linear().range([0, si.width]);
        var y = d3.scale.linear().range([si.height,0]);
        x.domain(d3.extent(scope.graphData, function(d) { return d.pos; }));
        y.domain([0,1]);

        // SVG canvas
        var svg = d3Helper.getSvgCanvas('#diso-graph',si);

        //**********************************************************************
        // Shading zone

        // Shading zone rectangle
        svg.append('rect')
         .attr('x', 0)
         .attr('y', y(0.5))
         .attr('width', si.width)
         .attr('height', y(0)-y(0.5))
         .attr('class', 'diso-shading-zone');

        //**********************************************************************
        // Axes

        var xAxis = d3.svg.axis().scale(x).orient('bottom');
        var yAxis = d3.svg.axis().scale(y).orient('left').ticks(3);

        // Add axes to canvas
        svg.append('g')
          .attr('class', 'x axis')
          .attr('transform', 'translate(0,' + si.height + ')')
          .call(xAxis);
        svg.append('g')
          .attr('class', 'y axis')
          .call(yAxis);

        // Axes labels
        svg.append('text')
          .attr('class', 'y label')
          .attr('text-anchor', 'middle')
          .attr('y', -40)
          .attr('x', -si.height/2)
          .attr('transform', 'rotate(-90)')
          .text('confidence');
        svg.append('text')
          .attr('class', 'y label diso-diso-label')
          .attr('text-anchor', 'middle')
          .attr('y', -60)
          .attr('x', -si.height/4)
          .attr('transform', 'rotate(-90)')
          .text('diso');
        svg.append('text')
          .attr('class', 'y label diso-bind-label')
          .attr('text-anchor', 'middle')
          .attr('y', -60)
          .attr('x', -si.height/4*3)
          .attr('transform', 'rotate(-90)')
          .text('bind');

        //**********************************************************************
        // Lines

        // Graph line functions
        var disorderLine = d3.svg.line()
          .x(function(d) { return x(d.pos); })
          .y(function(d) { return y(d.diso.value); });
        var bindingLine = d3.svg.line()
          .x(function(d) { return x(d.pos); })
          .y(function(d) { return y(d.bind.value); });
        // Add lines to canvas
        svg.append('path')
          .attr('class', 'line')
          .attr('d', disorderLine(scope.graphData))
          .style('stroke-width', 1)
          .style('stroke', 'red') ;
        svg.append('path')
          .attr('class', 'line')
          .attr('d', bindingLine(scope.graphData))
          .style('stroke-width', 1)
          .style('stroke', 'blue');

        //**********************************************************************
        // Popup tip

        var focus = svg.append('g').style('display', 'none');

        // Append the circle at the intersection
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

        // Container for amino acid text
        focus.append('rect')
          .attr('class', 'diso-tip')
          .attr('x', -10)
          .attr('y', -10)
          .attr('rx', 2)
          .attr('ry', 2)
          .attr('width', 20)
          .attr('height', 20);

        // Amino acid text
        focus.append('text')
          .attr('class', 'diso-tip-text')
          .attr('x', -0)
          .attr('y', 0)
          .attr('dy', 5)
          .text('A');

        // Append the circles at the intersection
        focus.append('circle')
            .attr('class', 'diso-tip-circle-diso')
            .attr('r', 2);
        focus.append('circle')
            .attr('class', 'diso-tip-circle-bind')
            .attr('r', 2);

        // Move tip with mouse and set text
        var bisect = d3.bisector(function(d) { return d.pos; }).left;
        var mousemove = function() {
            var x0 = x.invert(d3.mouse(this)[0]),
                i = bisect(scope.graphData, x0, 1),
                d0 = scope.graphData[i - 1],
                d1 = scope.graphData[i],
                d = x0 - d0.pos > d1.pos - x0 ? d1 : d0;
            //TODO: this is unecessarily complicated, positions are integers
          focus.select('circle.diso-tip-circle-diso')
            .attr('transform','translate(0,' + y(d.diso.value) + ')');
          focus.select('circle.diso-tip-circle-bind')
            .attr('transform','translate(0,' + y(d.bind.value) + ')');
          focus.select('text.diso-tip-text').text(d.amino);
          focus.attr('transform', 'translate(' + x(d.pos) + ')');
        };

        // append the rectangle to capture mouse
        svg.append('rect')
            .attr('width', si.width)
            .attr('height', si.height)
            .style('fill', 'none')
            .style('pointer-events', 'all')
            .on('mouseover', function() { focus.style('display', null);})
            .on('mouseout', function() { focus.style('display', 'none');})
            .on('mousemove', mousemove);

      }
    };
  });
