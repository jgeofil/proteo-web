'use strict';

angular.module('proteoWebApp')
  .directive('orfFullLayout', function () {
    return {
      templateUrl: 'components/directives/orf-full-layout/orf-full-layout.html',
      restrict: 'EA',
      scope: {
        oflOrf: '=',
        //TODO: should be in the ORF object
        oflBasePath: '='
      },
      link: function (scope, element, attrs) {


        // Controls spacing between amino acids
        scope.graphSpacing = 10;

        //**********************************************************************
        // State and parameters
        //**********************************************************************

        // Ng-scrollable config
        scope.scrollConf = {
          scrollX:'bottom',
          useBothWheelAxes: true,
          preventKeyEvents: false
        };

        var containerIds = ['#scroll1', '#scroll2', '#scroll3', '#scroll4', '#scroll5', '#scroll6'];
        containerIds.forEach(function(id){
          $(id).scroll(function() {
            containerIds.forEach(function(idTo){
              if(idTo !== id){
                $(idTo).scrollLeft($(id).scrollLeft());
              }
            });
          });
        });

        var StateObj = function(){
          this.isOpen = true;
          this.toggle = function (){this.isOpen = !this.isOpen;};
          this.infoOpen = false;
          this.toggleInfo = function (){this.infoOpen = !this.infoOpen;};
          this.isPresent = false;
        };

        // State for the analysis panels
        scope.state = {
          primary: new StateObj(),
          disopred: new StateObj(),
          itasser: new StateObj(),
          tmhmm: new StateObj(),
          topcons: new StateObj()
        };

        scope.$watch('oflOrf', function(orf){
          console.log(orf)
          if(orf){
            scope.state.primary.isPresent = orf.sequence.length > 0;
            scope.state.disopred.isPresent = orf.analysis.disopred !== null;
            scope.state.tmhmm.isPresent = orf.analysis.tmhmm !== null;
            scope.state.topcons.isPresent = orf.analysis.topcons !== null;
            scope.state.itasser.isPresent = orf.analysis.itasser !== null;
          }




          console.log(scope.oflBasePath)

          scope.config = {
            sequence:{
              path: scope.oflBasePath,
              files: [
                {
                  title: 'FASTA',
                  type: 'text/plain',
                  file: 'fasta'
                }
              ]
            },
            disopred:{
              path: scope.oflBasePath + '/analysis/disopred',
              files: [
                {
                  title: 'Disorder',
                  type: 'text/plain',
                  file: 'disopred.seq.diso'
                },
                {
                  title: 'Binding',
                  type: 'text/plain',
                  file: 'disopred.seq.pbdat'
                }
              ]
            },
            tmhmm:{
              path: scope.oflBasePath + '/analysis/tmhmm',
              files: [
                {
                  title: 'Domains',
                  type: 'text/plain',
                  file: 'tmhmm.long'
                },
                {
                  title: 'Residues',
                  type: 'text/plain',
                  file: 'tmhmm.plp'
                }
              ]
            },
            topcons:{
              path: scope.oflBasePath + '/analysis/topcons',
              files: [
                {
                  title: 'Topcons',
                  type: 'text/plain',
                  file: 'topcons.txt'
                }
              ]
            },
            itasser:{
              path: scope.oflBasePath + '/analysis/itasser/predictions',
              files: [
                {
                  title: 'Coverage',
                  type: 'text/plain',
                  file: 'coverage'
                },
                {
                  title: 'CScore',
                  type: 'text/plain',
                  file: 'cscore'
                },
                {
                  title: 'Secondary sequence',
                  type: 'text/plain',
                  file: 'seq.ss'
                }
              ]
            }
          };
        });





      }
    };
  });
