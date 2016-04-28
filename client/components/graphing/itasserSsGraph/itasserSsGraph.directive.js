'use strict';
//TODO: include D3 in a more Angular way
/* jshint undef: false*/
angular.module('proteoWebApp')
  .directive('itasserSsGraph', function (d3Helper) {
    return {
      templateUrl: 'components/graphing/itasserSsGraph/itasserSsGraph.html',
      restrict: 'E',
      scope:{
        graphDataSs: '='
      },
      link: function (scope, element, attrs) {
        var seqln = scope.graphDataSs.length; //Length of the sequence alignement

        // Size and margins
        var si = d3Helper.getSizing(120, 10, 20, seqln);
        var conHeight = si.height-20;

        // Scales and domains
        var x = d3.scale.linear().range([0, si.width]);
        var yCon = d3.scale.linear().range([conHeight,0]);
        x.domain(d3.extent(scope.graphDataSs, function(d) { return d.pos; }));
        yCon.domain([0,1]);
        var step = x(0)-x(1);

        // Create SVG D3 container
        var svg = d3Helper.getSvgCanvas('#itasser-ss-graph',si);

        //**********************************************************************
        // Axes
        var xAxis = d3.svg.axis().scale(x).orient('bottom');
        var yConAxis = d3.svg.axis().scale(yCon).orient('left').ticks(3);

        svg.append('g')
          .attr('class', 'x axis')
          .attr('transform', 'translate(0,' + si.height + ')')
          .call(xAxis);
        svg.append('g')
          .attr('class', 'y axis')
          .call(yConAxis);

        //**********************************************************************
        // Lines
        var conLine = d3.svg.line()
          .x(function(d) { return x(d.pos); })
          .y(function(d) { return yCon(Math.max(d.confidence.coil,d.confidence.beta,d.confidence.helix)); });

        svg.append('path')
          .attr('class', 'itasser-con-line')
          .attr('d', conLine(scope.graphDataSs))
          .style('stroke-width', 1)
          .style('stroke', 'grey') ;

        //**********************************************************************
        // Popup tip
        var tip = d3.tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0])
          .html(function(d) {
            return "<span style='color:white'>" + d.amino +"-"+ d.pos+ "</span>";
          });
        svg.call(tip);

        //**********************************************************************
        // Secondary sequence

        // Support line
        svg.append('svg:line')
          .attr('x1', 0)
          .attr('x2', si.width)
          .attr('y1', si.height -10)
          .attr('y2', si.height -10)
          .style('stroke', 'black')
          .style('stroke-width', 1);

        // Color blocks
        svg.selectAll('rect')
          .data(scope.graphDataSs)
          .enter().append('svg:rect')
          .attr('x', function(d) { return x(d.pos-1)-(step/2); })
          .attr('y', si.height -15)
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

        //**********************************************************************
        // Labels
        svg.append('text')
          .attr('class', 'y label')
          .attr('text-anchor', 'middle')
          .attr('y', -40)
          .attr('x', -conHeight/2)
          .attr('transform', 'rotate(-90)')
          .text('confidence');
        svg.append('text')
          .attr('class', 'y label itasser-label-helix')
          .attr('text-anchor', 'middle')
          .attr('y', -60)
          .attr('x', -conHeight/4)
          .attr('transform', 'rotate(-90)')
          .text('Helix');
        svg.append('text')
          .attr('class', 'y label itasser-label-beta')
          .attr('text-anchor', 'middle')
          .attr('y', -60)
          .attr('x', -conHeight/4*3)
          .attr('transform', 'rotate(-90)')
          .text('Beta');


      }
    };
  });
