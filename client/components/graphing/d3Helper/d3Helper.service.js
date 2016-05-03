'use strict';

angular.module('proteoWebApp')
  .service('d3Helper', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function

    this.params = {
      margins: {
        left: 90,
        right: 20
      },
      spacing: 10
    };

    this.getSizing = function(height, top, bottom, seqLength){
      return {
        margins: {
          top: top,
          right: this.params.margins.right,
          bottom: bottom,
          left: this.params.margins.left
        },
        spacing: this.params.spacing,
        width: (seqLength * this.params.spacing) - this.params.margins.right - this.params.margins.left,
        height: height - top - bottom
      };
    };

    this.getSvgCanvas = function(name, sizing){
      var elem = d3.select(name);
      var svg = elem.append('svg')
        .attr('width', sizing.width + sizing.margins.left + sizing.margins.right)
        .attr('height', sizing.height + sizing.margins.top + sizing.margins.bottom)
        .append('g')
        .attr('transform', 'translate(' + sizing.margins.left + ',' + sizing.margins.top + ')');
      return svg;
    };
  });
