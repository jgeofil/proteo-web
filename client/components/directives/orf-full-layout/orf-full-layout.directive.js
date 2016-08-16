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
        oflOrfItasserModels: '=',
        oflFirstClosed: '='
      },
      link: function (scope, el, attrs) {
        //**********************************************************************
        // State and parameters
        //**********************************************************************
        scope.downData = Download.triggerDownloadFromData;

        // Controls spacing between amino acids
        scope.graphSpacing = 10;

        scope.scrollPos = 0;

        scope.$watch('oflFirstClosed', function(){
          if(scope.oflFirstClosed){
            scope.state.primary = scope.oflFirstClosed.primary;
            scope.state.disopred = scope.oflFirstClosed.disopred;
            scope.state.tmhmm = scope.oflFirstClosed.tmhmm;
            scope.state.topcons = scope.oflFirstClosed.topcons;
            scope.state.itasser = scope.oflFirstClosed.itasser;
          }

        });

        // State for the analysis panels
        scope.state = {
          primary: true,
          disopred: true,
          itasser: true,
          itasserModels: false,
          tmhmm: true,
          topcons: true
        };

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


        //**********************************************************************
        // Itasser Models
        scope.$watch('oflOrfItasserModels', function(ms){
          if(ms){
            scope.state.itasserModels = true;
            $timeout(function(){
              scope.oflOrfItasserModels.forEach(function(model,i){
                var element = $(document.getElementsByClassName('itasser-model-box')[i]);

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
            });
          }
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
