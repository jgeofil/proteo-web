'use strict';
//TODO: include D3 in a more Angular way
/* jshint undef: false*/
angular.module('proteoWebApp')
.directive('tmhmmGraph', function (d3Helper) {
  return {
    templateUrl: 'components/graphing/tmhmmGraph/tmhmmGraph.html',
    restrict: 'E',
    scope: {
      graphData: '='
    },
    link: function (scope, element, attrs) {
      //Length of the sequence alignement
      var seqln = scope.graphData.data.sequential.length-1;

      // Size and margins
      var si = d3Helper.getSizing(120, 10, 25, seqln);
      var conHeight = si.height-25;

      //Scales and domain
      var x = d3.scale.linear().range([0, si.width]);
      var yProb = d3.scale.linear().range([conHeight,0]);
      x.domain(d3.extent(scope.graphData.data.sequential, function(d) { return d.position; }));
      yProb.domain([0,1]);
      var range = x(1)-x(0);

      // Create SVG D3 container
      var svg = d3Helper.getSvgCanvas(element.children()[0],si);

      //**********************************************************************
      // Lines
      var memLine = d3.svg.line()
      .x(function(d) { return x(d.position); })
      .y(function(d) { return yProb(d.membrane); });
      var outLine = d3.svg.line()
      .x(function(d) { return x(d.position); })
      .y(function(d) { return yProb(d.outside); });
      var inLine = d3.svg.line()
      .x(function(d) { return x(d.position); })
      .y(function(d) { return yProb(d.inside); });

      svg.append('path')
      .attr('class', 'line')
      .attr('d', memLine(scope.graphData.data.sequential))
      .style('stroke-width', 1)
      .style('stroke', 'red') ;
      svg.append('path')
      .attr('class', 'line')
      .attr('d', inLine(scope.graphData.data.sequential))
      .style('stroke-width', 1)
      .style('stroke', 'blue') ;
      svg.append('path')
      .attr('class', 'line')
      .attr('d', outLine(scope.graphData.data.sequential))
      .style('stroke-width', 1)
      .style('stroke', 'grey');

      //**********************************************************************
      // Axes
      var xAxis = d3.svg.axis().scale(x).orient('bottom');
      var yProbAxis = d3.svg.axis().scale(yProb).orient('left').ticks(3);

      svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + si.height + ')')
      .call(xAxis);
      svg.append('g')
      .attr('class', 'y axis')
      .call(yProbAxis);

      //**********************************************************************
      // Popup tip
      var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        return "<span style='color:white'>" + d.start +"-"+ d.end+ "</span>";
      });
      svg.call(tip);

      //**********************************************************************
      // Protein data.domains rectangles
      svg.selectAll('rect')
      .data(scope.graphData.data.domains)
      .enter().append('svg:rect')
      .attr('x', function(d) { return x(d.start)-range/2; })
      .attr('y', function(d){
        switch(d.name){
          case 'TMhelix':
          return si.height-15;
          case 'inside':
          return si.height-10;
          default:
          return si.height-15;
        }
      })
      .attr('width', function(d) { return x(d.end)-x(d.start)+range; })
      .attr('height', function(d){
        switch(d.name){
          case 'TMhelix':
          return 10;
          case 'inside':
          return 5;
          default:
          return 5;
        }
      })
      .attr('class', function(d){
        switch(d.name){
          case 'TMhelix':
          return 'tmhmm-helix';
          case 'inside':
          return 'tmhmm-inside';
          default:
          return 'tmhmm-outside';
        }
      })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

      //**********************************************************************
      // Axes labels
      svg.append('text')
      .attr('class', 'y label')
      .attr('text-anchor', 'middle')
      .attr('y', -40)
      .attr('x', -(conHeight/2))
      .attr('transform', 'rotate(-90)')
      .text('confidence');
      svg.append('text')
      .attr('class', 'y label tmhmm-label-tm')
      .attr('text-anchor', 'middle')
      .attr('y', -60)
      .attr('x', -(conHeight/6))
      .attr('transform', 'rotate(-90)')
      .text('TM');
      svg.append('text')
      .attr('class', 'y label tmhmm-label-in')
      .attr('text-anchor', 'middle')
      .attr('y', -60)
      .attr('x', -(conHeight/6*3))
      .attr('transform', 'rotate(-90)')
      .text('In');
      svg.append('text')
      .attr('class', 'y label tmhmm-label-out')
      .attr('text-anchor', 'middle')
      .attr('y', -60)
      .attr('x', -(conHeight/6*5))
      .attr('transform', 'rotate(-90)')
      .text('Out');

    }
  };
});
