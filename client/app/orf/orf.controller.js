'use strict';
//TODO: include D3 in a more Angular way
/* jshint undef: false*/
angular.module('proteoWebApp')
.controller('OrfCtrl', function ($scope, $http, $routeParams, $rootScope, $uibModal, Download) {

  $scope.downData = Download.triggerDownloadFromData;
  $scope.downUrl = Download.triggerDownloadFromUrl;

  // Base path for API
  var abp = '/api/data/'+$routeParams.projectName+'/dataset/'+
    $routeParams.datasetName+'/orf/'+$routeParams.orfName;

  $scope.config = {
    sequence:{
      path: abp,
      files: [
        {
          title: 'FASTA',
          type: 'text/plain',
          file: 'fasta'
        }
      ]
    },
    disopred:{
      path: abp + '/analysis/disopred',
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
      path: abp + '/analysis/tmhmm',
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
      path: abp + '/analysis/topcons',
      files: [
        {
          title: 'Topcons',
          type: 'text/plain',
          file: 'topcons.txt'
        }
      ]
    },
    itasser:{
      path: abp + '/analysis/itasser/predictions',
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
  $scope.state = {
    primary: new StateObj(),
    disopred: new StateObj(),
    itasser: new StateObj(),
    tmhmm: new StateObj(),
    topcons: new StateObj()
  };

  // Page title, aka ORF name
  $scope.orfName = $routeParams.orfName;

  // Controls spacing between amino acids
  $scope.graphSpacing = 10;

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
  // ORF
  //**************************************************************************
  $http.get(abp).then(function(response){
    $scope.metadata = response.data.meta;
    $scope.orfObj = response.data;
    if($scope.orfObj.sequence.length > 0){
      $scope.state.primary.isPresent = true;
    }

  }, handleErrors);

  //**************************************************************************
  // Images
  //**************************************************************************
  var imgBasePath = abp + '/analysis/images/';

  $http.get(imgBasePath).then(function(response){
      $scope.images = response.data;
      $scope.images.forEach(function(img){
        Download.getLink(imgBasePath + img.name, 'image/jpeg').then(function(link){
          img.url = link;
        });
      });
  }, handleErrors);



  //**************************************************************************
  // Models
  //**************************************************************************
  $http.get(abp + '/analysis/models')
  .then(function(data){
    var count = 0;
    $scope.models = data.data.data;

    // Get PDB files for each model
    $scope.models.forEach(function(model){
      $http.get(abp + '/analysis/models/' + model.shortName)
      .then(function(md){

        model.data = md.data;
        count +=1;
        if(count === $scope.models.length-1){
          $scope.modelsLoaded = true;
        }
      });
    }, handleErrors);
  }, handleErrors);

  //**************************************************************************
  // DISOPRED3
  //**************************************************************************
  $http.get(abp + '/analysis/disopred')
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
        console.log(response)
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
      console.log(data.data)
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
