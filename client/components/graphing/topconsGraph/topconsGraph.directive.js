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
          var seqln = scope.graphData.zcord.length; //Length of the sequence alignement
          var data = scope.graphData;
          console.log(data)

          var lineGraphHeight = 50;

          var margin = {top: 20, right: 20, bottom: 35, left: 90};
          var width = (seqln*15) - margin.left - margin.right;
          var height = lineGraphHeight + scope.graphData.pred.length * 12 + 20;

          var x = d3.scale.linear().range([0, width]);
          var xAxis = d3.svg.axis().scale(x).orient('bottom');
          var yProb = d3.scale.linear().range([lineGraphHeight,0]);
          var yProbAxis = d3.svg.axis().scale(yProb).orient('left').ticks(3);

          /**
          var memLine = d3.svg.line()
            .x(function(d) { return x(d.pos); })
            .y(function(d) { return yProb(d.zcord?d.zcord:0); });

          var outLine = d3.svg.line()
            .x(function(d) { return x(d.pos); })
            .y(function(d) { return yProb(d.deltaG?d.delta:null); });



          var inLine = d3.svg.line()
            .x(function(d) { return x(d.pos); })
            .y(function(d) { return yProb(d.topRel?d.topRel:null); });
  **/
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
          x.domain(d3.extent(scope.graphData.zcord, function(d,i) { return i; }));
          yProb.domain([0,25]);

          var range = x(1)-x(0);

          var body = svg.append('g')
            .attr('transform', 'translate(0,'+ (lineGraphHeight+15) +')');

          // Create sequence containers
          var sequences = body.selectAll('g')
            .data(data.pred).enter()
            .append('g')
            .attr('transform', function(d,i){return 'translate(0,' + (i*12) + ')';});

          sequences.selectAll('rect')
            .data(function(d){return d.values})
            .enter().append('svg:rect')
            .attr('x', function(d,i) { return x(i)-range/2; })
            .attr('y', function(d){
              switch(d){
                case 'M':
                  return 0;
                case 'i':
                  return 0;
                default:
                  return 5;
              }
            })
            .attr('width', function(d,i) { return x(i)-x(i)+range; })
            .attr('height', function(d){
              switch(d){
                case 'M':
                  return 10;
                case 'i':
                  return 5;
                default:
                  return 5;
              }
            })
            .attr('class', function(d){
              switch(d){
                case 'M':
                  return 'topcons-membrane';
                case 'i':
                  return 'topcons-inside';
                default:
                  return 'topcons-outside';
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
            .call(yProbAxis);

          svg.append('text')
            .attr('class', 'y label')
            .attr('text-anchor', 'middle')
            .attr('y', -40)
            .attr('x', 10-height/2)
            .attr('transform', 'rotate(-90)')
            .text('confidence');




        }
    };
  });
