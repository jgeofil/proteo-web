'use strict';
/* jshint undef: false*/
angular.module('proteoWebApp')
  .directive('topconsGraph', function (d3Helper) {
    return {
      templateUrl: 'components/graphing/topconsGraph/topconsGraph.html',
      restrict: 'EA',      scope:{
          graphData: '=',
          graphSpacing: '='
        },
        link: function (scope, element, attrs) {
          //Length of the sequence alignement
          var seqln = scope.graphData.zCord.length;
          var data = scope.graphData;

          // Size and margins
          var lineGraphHeight = 100;
          var si = d3Helper.getSizing(lineGraphHeight + (data.predictions.length * 20), 10, 20, seqln);

          //Scales and domains
          var x = d3.scale.linear().range([1, si.width]);
          var yProb = d3.scale.linear().range([(lineGraphHeight/2)-5,0]);
          var yZcord = d3.scale.linear().range([lineGraphHeight,(lineGraphHeight/2)+5]);
          x.domain(d3.extent(scope.graphData.zCord, function(d,i) { return i+1; }));
          yProb.domain([0,1]);
          yZcord.domain([0,25]);
          var range = x(1)-x(0);

          // Create SVG D3 container
          var svg = d3Helper.getSvgCanvas(element.children()[0],si);
          // Sub-containers
          var body = svg.append('g')
            .attr('transform', 'translate(0,'+ (lineGraphHeight+15) +')');
          var ids = svg.append('g')
            .attr('transform', 'translate(0,'+ (lineGraphHeight+21) +')');

          //**********************************************************************
          // Axes
          var xAxis = d3.svg.axis().scale(x).orient('bottom');
          var yProbAxis = d3.svg.axis().scale(yProb).orient('left').ticks(3);
          var yZcordAxis = d3.svg.axis().scale(yZcord).orient('left').ticks(3);

          svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + si.height + ')')
            .call(xAxis);
          svg.append('g')
            .attr('class', 'y axis')
            .call(yProbAxis);
          svg.append('g')
            .attr('class', 'y axis')
            .call(yZcordAxis);

          //**********************************************************************
          // Lines
          var zCordLine = d3.svg.line()
            .x(function(d) { return x(d.pos); })
            .y(function(d) { return yZcord(d.value); });
          var deltaGLine = d3.svg.line()
            .x(function(d) { return x(d.pos); })
            .y(function(d) { return yZcord(d.value); });
          var topRelLine = d3.svg.line()
            .x(function(d) { return x(d.pos); })
            .y(function(d) { return yProb(d.value); });

          svg.append('path')
            .attr('class', 'line')
            .attr('d', zCordLine(scope.graphData.zCord))
            .style('stroke-width', 1)
            .style('stroke', 'black') ;
          svg.append('path')
            .attr('class', 'line')
            .attr('d', topRelLine(scope.graphData.topRel))
            .style('stroke-width', 1)
            .style('stroke', 'black') ;
          svg.append('path')
            .attr('class', 'line')
            .attr('d', deltaGLine(scope.graphData.deltaG))
            .style('stroke-width', 1)
            .style('stroke', 'grey') ;

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
          // Secondary sequence

          // Create sequence containers
          var sequences = body.selectAll('g')
            .data(data.predictions).enter()
            .append('g')
            .attr('transform', function(d,i){return 'translate(0,' + (i*12) + ')';})

          // Append ids
          ids.selectAll('text')
            .data(data.predictions).enter()
            .append('text')
            .attr('class', 'itasser-align-info')
            .attr('text-anchor', 'start')
            .attr('x', -65)
            .attr('y', function(d,i){return i*12;})
            .text(function(d){return d.method;});

          // Append secondary sequences rectangles
          sequences.selectAll('rect')
            .data(function(d){return d.values;})
            .enter().append('svg:rect')
            .attr('x', function(d,i) { return x(i+1)-range/2; })
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
            .attr('width', function(d,i) { return x(i+1)-x(i+1)+range; })
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
            });

          //**********************************************************************
          // Labels
          svg.append('text')
            .attr('class', 'y label')
            .attr('text-anchor', 'middle')
            .attr('y', -40)
            .attr('x', -lineGraphHeight/4)
            .attr('transform', 'rotate(-90)')
            .text('confidence');
          svg.append('text')
            .attr('class', 'y label')
            .attr('text-anchor', 'middle')
            .attr('y', -40)
            .attr('x', -3*lineGraphHeight/4)
            .attr('transform', 'rotate(-90)')
            .text('zCord').style('fill', 'black');
          svg.append('text')
            .attr('class', 'y label')
            .attr('text-anchor', 'middle')
            .attr('y', -60)
            .attr('x', -3*lineGraphHeight/4)
            .attr('transform', 'rotate(-90)')
            .text('deltaG').style('fill', 'grey');

          svg.append('text')
            .attr('class', 'y label')
            .attr('text-anchor', 'middle')
            .attr('y', -75)
            .attr('x', -lineGraphHeight-15-((6*12)/6*5))
            .attr('transform', 'rotate(-90)')
            .text('Helix').style('fill', 'red');
          svg.append('text')
            .attr('class', 'y label')
            .attr('text-anchor', 'middle')
            .attr('y', -75)
            .attr('x', -lineGraphHeight-15-((6*12)/2))
            .attr('transform', 'rotate(-90)')
            .text('In').style('fill', 'blue');
          svg.append('text')
            .attr('class', 'y label')
            .attr('text-anchor', 'middle')
            .attr('y', -75)
            .attr('x', -lineGraphHeight-15-((6*12)/6))
            .attr('transform', 'rotate(-90)')
            .text('Out').style('fill', 'grey');

        }
    };
  });
