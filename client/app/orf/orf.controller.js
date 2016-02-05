'use strict';
//TODO: include D3 in a more Angular way
/* jshint undef: false*/
angular.module('proteoWebApp')
.controller('OrfCtrl', function ($scope, $http, $routeParams, $rootScope, $uibModal) {

  //**************************************************************************
  // State
  //**************************************************************************
  $scope.state = {
    disopred:{
      isOpen: true,
      toggle: function (){this.isOpen = !this.isOpen;},
      isPresent: false
    },
    itasser:{
      isOpen: true,
      toggle: function (){this.isOpen = !this.isOpen;},
      isPresent: false
    },
    tmhmm:{
      isOpen: true,
      toggle: function (){this.isOpen = !this.isOpen;},
      isPresent: false
    },
    topcons:{
      isOpen: true,
      toggle: function (){this.isOpen = !this.isOpen;},
      isPresent: false
    }
  };

  //**************************************************************************
  // Model Modal
  //**************************************************************************
  $scope.spawnModelModal = function(pdb){
    var modalInstance = $uibModal.open({
    animation: true,
    templateUrl: 'modelModal.html',
    controller: 'ModelModalCtrl',
    size: 'lg',
    resolve: {
      pdb: function () {
        return pdb;
      }
    }
    });

  };

  //**************************************************************************
  // Scrolling controls
  //**************************************************************************
  $scope.posX = 0;
  $scope.moveX = function (pixels) {
    $scope.posX = $scope.posX + pixels;
  };

  //**************************************************************************
  // DISOPRED3
  //**************************************************************************
  $http.get('/api/data/' + $routeParams.datasetName + '/orf/' +
  $routeParams.orfName + '/analysis/disopred3')
  .then(function(data){
    var inDat = data.data.data;
    $scope.disoGraphData = inDat;
    $scope.state.disopred.isPresent = true;

  });

  //**************************************************************************
  // ITASSER
  //**************************************************************************
  $http.get('/api/data/' + $routeParams.datasetName + '/orf/' +
  $routeParams.orfName + '/analysis/itasser/models')
  .then(function(data){
    $scope.itasserModels = data.data;
    $scope.state.itasser.isPresent = true;

    $scope.itasserModels.forEach(function(model){
      $http.get('/api/data/' + $routeParams.datasetName + '/orf/' +
      $routeParams.orfName + '/analysis/itasser/models/'+model.name)
      .then(function(data){

        model.data = data.data;
        // Assume there exists an HTML div with id 'gldiv'
        var element = $('#gldiv-'+model.name);

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
  });

  $http.get('/api/data/' + $routeParams.datasetName + '/orf/' +
  $routeParams.orfName + '/analysis/itasser/predictions')
  .then(function(response){
    $scope.itasserSsGraphData = response.data;

    $scope.itasserAlignGraphData = response.data.align;

  });

  //**************************************************************************
  // TMHMM
  //**************************************************************************
  $http.get('/api/data/' + $routeParams.datasetName + '/orf/' +
  $routeParams.orfName + '/analysis/tmhmm')
  .then(function(data){
    $scope.tmhmmGraphData = data.data;
    $scope.state.tmhmm.isPresent = true;
  });
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
