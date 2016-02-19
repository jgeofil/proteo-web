'use strict';
/* jshint undef: false*/
angular.module('proteoWebApp')
  .directive('topconsGraph', function () {
    return {
      templateUrl: 'components/graphing/topconsGraph/topconsGraph.html',
      restrict: 'EA',      scope:{
          graphData: '='
        },
        link: function (scope, element, attrs) {
          var seqln = scope.graphData.length-1; //Length of the sequence alignement
          console.log(scope.graphData)

          var margin = {top: 20, right: 20, bottom: 35, left: 90};
          var width = (seqln*15) - margin.left - margin.right;
          var height = 100;

          var x = d3.scale.linear().range([0, width]);
          var xAxis = d3.svg.axis().scale(x).orient('bottom');
          var yProb = d3.scale.linear().range([height-25,0]);
          var yProbAxis = d3.svg.axis().scale(yProb).orient('left').ticks(3);

          var memLine = d3.svg.line()
            .x(function(d) { return x(d.pos); })
            .y(function(d) { return yProb(d.zcord?d.zcord:0); });

          var outLine = d3.svg.line()
            .x(function(d) { return x(d.pos); })
            .y(function(d) { return yProb(d.deltaG?d.delta:null); });

          var inLine = d3.svg.line()
            .x(function(d) { return x(d.pos); })
            .y(function(d) { return yProb(d.topRel?d.topRel:null); });

          var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
              return "<span style='color:white'>" + d.start +"-"+ d.end+ "</span>";
            });

          var svg = d3.select('#topcons-graph').append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

          svg.call(tip);
          x.domain(d3.extent(scope.graphData, function(d) { return d.pos; }));
          yProb.domain([0,25]);

          var range = x(1)-x(0);

          svg.selectAll('rect')
            .data(scope.graphData)
            .enter().append('svg:rect')
            .attr('x', function(d) { return x(d.pos)-range/2; })
            .attr('y', function(d){
              switch(d.scampiSeq){
                case 'M':
                  return height-15;
                case 'i':
                  return height-10;
                default:
                  return height-15;
              }
            })
            .attr('width', function(d) { return x(d.pos)-x(d.pos)+range; })
            .attr('height', function(d){
              switch(d.scampiSeq){
                case 'M':
                  return 10;
                case 'i':
                  return 5;
                default:
                  return 5;
              }
            })
            .attr('class', function(d){
              switch(d.scampiSeq){
                case 'M':
                  return 'tmhmm-helix';
                case 'i':
                  return 'tmhmm-inside';
                default:
                  return 'tmhmm-outside';
              }
            })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);

          svg.append('rect')
            .attr('x', -30)
            .attr('y', height-15)
            .attr('height', 15)
            .attr('width', 30)
            .attr('class', 'tmhmm-block');

          svg.append('rect')
            .attr('x', x(seqln))
            .attr('y', height-15)
            .attr('height', 15)
            .attr('width', 30)
            .attr('class', 'tmhmm-block');

          svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis);

          svg.append('g')
            .attr('class', 'y axis')
            .call(yProbAxis);

          svg.append('text')
            .attr('class', 'y label')
            .attr('text-anchor', 'middle')
            .attr('y', -40)
            .attr('x', 10-height/2)
            .attr('transform', 'rotate(-90)')
            .text('confidence');

          svg.append('path')
            .attr('class', 'line')
            .attr('d', memLine(scope.graphData))
            .style('stroke-width', 1)    // set the stroke width
            .style('stroke', 'red') ;

          svg.append('path')
            .attr('class', 'line')
            .attr('d', inLine(scope.graphData))
            .style('stroke-width', 1)    // set the stroke width
            .style('stroke', 'blue') ;

          svg.append('path')
            .attr('class', 'line')
            .attr('d', outLine(scope.graphData))
            .style('stroke-width', 1)    // set the stroke width
            .style('stroke', 'grey') ;

          var legend = svg.append('g')
        	  .attr('class', 'legend')
        	  .attr('x', 20)
        	  .attr('y', height+25)
        	  .attr('height', 100)
        	  .attr('width', 100);

        	legend.selectAll('g')
            .data([
              {
                name: 'TM-Helix',
                color: 'red'
              },
              {
                name: 'Inside',
                color: 'blue'
              },
              {
                name: 'Outside',
                color: 'grey'
              }
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
