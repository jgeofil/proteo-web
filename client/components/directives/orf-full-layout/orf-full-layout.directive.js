'use strict';

angular.module('proteoWebApp')
  .directive('orfFullLayout', function ($timeout, $uibModal, Download) {
    return {
      templateUrl: 'components/directives/orf-full-layout/orf-full-layout.html',
      restrict: 'EA',
      scope: {
        oflOrf: '=',
        //TODO: should be in the ORF object
        oflBasePath: '=',
        oflOrfItasserModels: '='
      },
      link: function (scope, el, attrs) {
        scope.downData = Download.triggerDownloadFromData;

        // Controls spacing between amino acids
        scope.graphSpacing = 10;

        //**********************************************************************
        // State and parameters
        //**********************************************************************



          // 3D model modal window
          scope.spawnModelModal = function(pdb){
            $uibModal.open({
              animation: true,
              templateUrl: 'modelModal.html',
              controller: 'ModelModalCtrl',
              size: 'lg',
              resolve: {
                pdb: function () {return pdb;}
              }
            });
          };

        // Ng-scrollable config
        scope.scrollConf = {
          scrollX:'bottom',
          useBothWheelAxes: true,
          preventKeyEvents: false
        };

        var scrollZones = el[0].getElementsByClassName('orf-scroll');
        var jZones = [];

        for(var i = 0; i < scrollZones.length; i++){
          jZones.push($(scrollZones[i]));
        }

        jZones.forEach(function(zone1){
          zone1.scroll(function() {
            jZones.forEach(function(zone2){
              if(zone1 !== zone2){
                zone2.scrollLeft(zone1.scrollLeft());
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
          itasserModels: false,
          tmhmm: new StateObj(),
          topcons: new StateObj()
        };

        scope.$watch('oflOrfItasserModels', function(ms){
          if(ms){
            scope.state.itasserModels = true;
            scope.oflOrfItasserModels.forEach(function(model,i){
              var element = $(el[0].getElementsByClassName('itasser-model-box')[i]);
              // Viewer config - properties 'defaultcolors' and 'callback'
              var config = {defaultcolors: $3Dmol.rasmolElementColors };
              // Create GLViewer within 'gldiv'
              var myviewer = $3Dmol.createViewer(element, config);
              //'data' is a string containing molecule data in pdb format
              myviewer.addModel(String(model.data), 'pdb');
              myviewer.setBackgroundColor(0xffffff);
              myviewer.setStyle({}, {cartoon: {color: 'spectrum'}});
              myviewer.zoomTo();
              myviewer.render();
            });
          }
        });

        scope.$watch('oflOrf', function(orf){
          if(orf){
            scope.state.primary.isPresent = orf.sequence.length > 0;
            scope.state.disopred.isPresent = orf.analysis.disopred !== null;
            scope.state.tmhmm.isPresent = orf.analysis.tmhmm !== null;
            scope.state.topcons.isPresent = orf.analysis.topcons !== null;
            scope.state.itasser.isPresent = orf.analysis.itasser !== null;
          }




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
  })

  //**************************************************************************
  // Modal window controller
  //**************************************************************************
  .controller('ModelModalCtrl', function ($scope, $uibModalInstance, pdb) {
    $scope.pdb = pdb;
    $scope.ok = function () {
      $uibModalInstance.close();
    };
    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  });
