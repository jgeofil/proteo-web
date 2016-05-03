'use strict';
//TODO: include D3 in a more Angular way
/* jshint undef: false*/
angular.module('proteoWebApp')
.controller('OrfCtrl', function ($scope, $http, $routeParams, $rootScope, $uibModal, $timeout, $window) {

  // Base path for API
  var abp = '/api/data/'+$routeParams.projectName+'/dataset/'+
    $routeParams.datasetName+'/orf/'+$routeParams.orfName;

  // Handle errors while fetching data
  function handleErrors(err){
    console.log(err);
  }

  //**************************************************************************
  // State and parameters
  //**************************************************************************

  // Ng-scrollable config
  $scope.scrollConf = {
    scrollX:'bottom',
    useBothWheelAxes: true
  };


  var StateObj = function(){
    this.isOpen = true;
    this.toggle = function (){this.isOpen = !this.isOpen;};
    this.infoOpen = false;
    this.toggleInfo = function (){this.infoOpen = !this.infoOpen;};
    this.isPresent = false;
  };

  // State for the analysis panels
  $scope.state = {
    disopred: new StateObj(),
    itasser: new StateObj(),
    tmhmm: new StateObj(),
    topcons: new StateObj()
  };

  // Page title, aka ORF name
  $scope.orfName = $routeParams.orfName;

  // Controls spacing between amino acids
  $scope.graphSpacing = 10;

  // Position of scrolling for analyses
  $scope.posX = 0;
  var redrawn = 0;
  $scope.$watch('posX', function(){
    if(redrawn < 2){
        $('#orf-panel').hide().show(0);
        redrawn += 1;
    }
  });

  // 3D model modal window
  $scope.spawnModelModal = function(pdb){
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

  //**************************************************************************
  // MetaData
  //**************************************************************************
  $http.get(abp + '/analysis/meta/').then(function(response){
    $scope.metadata = response.data;
  }, handleErrors);

  //**************************************************************************
  // Images
  //**************************************************************************
  var imgBasePath = abp + '/analysis/images/';

  // Get images using auth tokens, standard <img> tag does not use tokens
  var getImageDataURL = function(imgObj, url, imageType = 'image/jpeg'){
    $http.get(url, {responseType: 'arraybuffer'}).then(function(res){
      let blob = new Blob([res.data], {type: imageType});
      imgObj.url = (window.URL || window.webkitURL).createObjectURL(blob);
    });
  };

  $http.get(imgBasePath).then(function(response){
      $scope.images = response.data;
      $scope.images.forEach(function(img){
        getImageDataURL(img, imgBasePath + img.name);
      });
  }, handleErrors);

  //**************************************************************************
  // DISOPRED3
  //**************************************************************************
  $http.get(abp + '/analysis/disopred3')
  .then(function(data){
    $scope.disoGraphData = data.data;
    $scope.state.disopred.isPresent = true;
  }, handleErrors);

  //**************************************************************************
  // ITASSER
  //**************************************************************************
  $http.get(abp + '/analysis/itasser/models')
  .then(function(data){
    $scope.itasserModels = data.data;
    $scope.state.itasser.isPresent = true;

    // Get PDB files for each model
    $scope.itasserModels.forEach(function(model){
      $http.get(abp + '/analysis/itasser/models/' + model.name)
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
    }, handleErrors);
  }, handleErrors);

  $http.get(abp + '/analysis/itasser/predictions')
  .then(function(response){
    $scope.itasserSsGraphData = response.data;
    $scope.itasserAlignGraphData = response.data.align;
  }, handleErrors);

  //**************************************************************************
  // TMHMM
  //**************************************************************************
  $http.get(abp + '/analysis/tmhmm')
    .then(function(data){
      $scope.tmhmmGraphData = data.data;
      $scope.state.tmhmm.isPresent = true;
    }, handleErrors);

  //**************************************************************************
  // topcons
  //**************************************************************************
  $http.get(abp + '/analysis/topcons')
    .then(function(data){
      $scope.topconsGraphData = data.data;
      $scope.state.topcons.isPresent = true;
    }, handleErrors);


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
