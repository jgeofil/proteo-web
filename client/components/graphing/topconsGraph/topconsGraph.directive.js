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
          var seqln = scope.graphData.zcord.length; //Length of the sequence alignement
          var data = scope.graphData;

          // Size and margins
          var lineGraphHeight = 100;
          var si = d3Helper.getSizing(lineGraphHeight + (data.pred.length * 12) + 80, 20, 35, seqln);

          var x = d3.scale.linear().range([1, si.width]);
          var xAxis = d3.svg.axis().scale(x).orient('bottom');

          var yProb = d3.scale.linear().range([(lineGraphHeight/2)-5,0]);
          var yProbAxis = d3.svg.axis().scale(yProb).orient('left').ticks(3);

          var yZcord = d3.scale.linear().range([lineGraphHeight,(lineGraphHeight/2)+5]);
          var yZcordAxis = d3.svg.axis().scale(yZcord).orient('left').ticks(3);

          var zCordLine = d3.svg.line()
            .x(function(d) { return x(d.pos); })
            .y(function(d) { return yZcord(d.value); });

          var deltaGLine = d3.svg.line()
            .x(function(d) { return x(d.pos); })
            .y(function(d) { return yZcord(d.value); });

          var topRelLine = d3.svg.line()
            .x(function(d) { return x(d.pos); })
            .y(function(d) { return yProb(d.value); });

          var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
              return "<span style='color:white'>" + d.start +"-"+ d.end+ "</span>";
            });

            // Create SVG D3 container
            var svg = d3Helper.getSvgCanvas('#topcons-graph',si);


          svg.call(tip);
          x.domain(d3.extent(scope.graphData.zcord, function(d,i) { return i+1; }));

          yProb.domain([0,1]);
          yZcord.domain([0,25]);

          var range = x(1)-x(0);

          var body = svg.append('g')
            .attr('transform', 'translate(0,'+ (lineGraphHeight+15) +')');

          var ids = svg.append('g')
            .attr('transform', 'translate(0,'+ (lineGraphHeight+15) +')');

          // Create sequence containers
          var sequences = body.selectAll('g')
            .data(data.pred).enter()
            .append('g')
            .attr('transform', function(d,i){return 'translate(0,' + (i*12) + ')';})

          ids.selectAll('text')
            .data(data.pred).enter()
            .append('text')
            .attr('class', 'itasser-align-info')
            .attr('text-anchor', 'start')
            .attr('x', -65)
            .attr('y', function(d,i){return i*12;})
            .text(function(d){return d.method;});

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

          svg.append('path')
            .attr('class', 'line')
            .attr('d', zCordLine(scope.graphData.zcord))
            .style('stroke-width', 1)    // set the stroke width
            .style('stroke', 'red') ;

          svg.append('path')
            .attr('class', 'line')
            .attr('d', topRelLine(scope.graphData.topRel))
            .style('stroke-width', 1)    // set the stroke width
            .style('stroke', 'blue') ;

          svg.append('path')
            .attr('class', 'line')
            .attr('d', deltaGLine(scope.graphData.deltaG))
            .style('stroke-width', 1)    // set the stroke width
            .style('stroke', 'grey') ;

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
            .text('zCord').style('fill', 'red');

          svg.append('text')
            .attr('class', 'y label')
            .attr('text-anchor', 'middle')
            .attr('y', -60)
            .attr('x', -3*lineGraphHeight/4)
            .attr('transform', 'rotate(-90)')
            .text('deltaG').style('fill', 'grey');

            var legend = svg.append('g')
              .attr('class', 'legend')
              .attr('x', 20)
              .attr('y', si.height+25)
              .attr('height', 100)
              .attr('width', 100);

            legend.selectAll('g')
              .data([
                {
                  name: 'Inside',
                  color: 'grey'
                },
                {
                  name: 'Outside',
                  color: 'blue'
                },
                {
                  name: 'Transmembrane',
                  color: 'red'
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
