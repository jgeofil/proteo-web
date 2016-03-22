'use strict';
//TODO: include D3 in a more Angular way
/* jshint undef: false*/
angular.module('proteoWebApp')
  .directive('tmhmmGraph', function (d3Helper) {
    return {
      templateUrl: 'components/graphing/tmhmmGraph/tmhmmGraph.html',
      restrict: 'EA',      scope:{
          graphData: '=',
          graphSpacing: '='
        },
        link: function (scope, element, attrs) {
          var seqln = scope.graphData.prob.length-1; //Length of the sequence alignement

          // Size and margins
          var si = d3Helper.getSizing(150, 20, 35, seqln);

          var x = d3.scale.linear().range([0, si.width]);
          var xAxis = d3.svg.axis().scale(x).orient('bottom');
          var yProb = d3.scale.linear().range([si.height-25,0]);
          var yProbAxis = d3.svg.axis().scale(yProb).orient('left').ticks(3);

          var memLine = d3.svg.line()
            .x(function(d) { return x(d.pos); })
            .y(function(d) { return yProb(d.membrane); });

          var outLine = d3.svg.line()
            .x(function(d) { return x(d.pos); })
            .y(function(d) { return yProb(d.outside); });

          var inLine = d3.svg.line()
            .x(function(d) { return x(d.pos); })
            .y(function(d) { return yProb(d.inside); });

          var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
              return "<span style='color:white'>" + d.start +"-"+ d.end+ "</span>";
            });

            // Create SVG D3 container
            var svg = d3Helper.getSvgCanvas('#tmhmm-graph',si);


          svg.call(tip);
          x.domain(d3.extent(scope.graphData.prob, function(d) { return d.pos; }));
          yProb.domain([0,1]);

          var range = x(1)-x(0);

          svg.selectAll('rect')
            .data(scope.graphData.domains)
            .enter().append('svg:rect')
            .attr('x', function(d) { return x(d.start)-range/2; })
            .attr('y', function(d){
              switch(d.type){
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
              switch(d.type){
                case 'TMhelix':
                  return 10;
                case 'inside':
                  return 5;
                default:
                  return 5;
              }
            })
            .attr('class', function(d){
              switch(d.type){
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

          svg.append('rect')
            .attr('x', -30)
            .attr('y', si.height-15)
            .attr('height', 15)
            .attr('width', 30)
            .attr('class', 'tmhmm-block');

          svg.append('rect')
            .attr('x', x(seqln))
            .attr('y', si.height-15)
            .attr('height', 15)
            .attr('width', 30)
            .attr('class', 'tmhmm-block');

          svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + si.height + ')')
            .call(xAxis);

          svg.append('g')
            .attr('class', 'y axis')
            .call(yProbAxis);

          svg.append('text')
            .attr('class', 'y label')
            .attr('text-anchor', 'middle')
            .attr('y', -40)
            .attr('x', 10-si.height/2)
            .attr('transform', 'rotate(-90)')
            .text('confidence');

          svg.append('path')
            .attr('class', 'line')
            .attr('d', memLine(scope.graphData.prob))
            .style('stroke-width', 1)    // set the stroke width
            .style('stroke', 'red') ;

          svg.append('path')
            .attr('class', 'line')
            .attr('d', inLine(scope.graphData.prob))
            .style('stroke-width', 1)    // set the stroke width
            .style('stroke', 'blue') ;

          svg.append('path')
            .attr('class', 'line')
            .attr('d', outLine(scope.graphData.prob))
            .style('stroke-width', 1)    // set the stroke width
            .style('stroke', 'grey') ;

          var legend = svg.append('g')
        	  .attr('class', 'legend')
        	  .attr('x', 20)
        	  .attr('y', si.height+25)
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
                .attr('y', si.height+25)
                .attr('width', 10)
                .attr('height', 10)
                .style('fill', d.color);

              g.append('text')
                .attr('x', 20+100*i+15)
                .attr('y', si.height+35)
                .attr('height',30)
                .attr('width',100)
                .style('fill', d.color)
                .text(d.name);

            });

        }
    };
  });
