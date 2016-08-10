'use strict';
//TODO: include D3 in a more Angular way
/* jshint undef: false*/
angular.module('proteoWebApp')
.controller('MainController', function ($scope, $http, $location, $routeParams,
  $timeout , $rootScope, NgTableParams, Datatree, Comparison) {
  // State of the coparison selection, kept in the comparison service
  $scope.comparison = Comparison;
  // If data is being loaded from server
  $scope.dataIsLoading = true;
  // Table containing data
  $scope.table = undefined;
  // Which table template is active
  $scope.active = 'NONE'; //PROJECT, DATASET, ORF
  // Selected project and dataset
  $scope.select = {
    project: undefined,
    dataset: undefined
  };
  // If it is the first time the controller loads.
  var pageLoad = true;

  var search = $location.search()?$location.search():{};

  // Initial parameters for the table
  var tableParameters = {
    page: Number(search.count || 10),
    count: Number(search.page || 1)
  };

  //****************************************************************************
  // Funcs
  //****************************************************************************

  /**
   * Sort datasets by number of available analyses
   * @param {Object} data List of ORFs.
   * @return {null} Sorted in place.
   */
  var dataSort = function(data){
    data.sort(function(a,b){
      if(a.analyses && b.analyses){
        return ((b.analyses.disopred?1:0) + (b.analyses.itasser?1:0) + (b.analyses.tmhmm?1:0) +
        (b.analyses.topcons?1:0))-((a.analyses.disopred?1:0) + (a.analyses.itasser?1:0) + (a.analyses.tmhmm?1:0) + (a.analyses.topcons?1:0));
      }else{
        return 0;
      }
    });
  };

  /**
   * Brings the specified property up one level in the object.
   * Necessary for sorting in ng-table.
   * @param {Object} data List of ORFs.
   * @return {null} Orfs in list are modified in place.
   */
  var setProperty = function(data, property){
    data = data.map(function(d){
      if(d.hasOwnProperty('meta')){
        d[property] = d.meta[property];
        return d;
      }
    });
  };

  //****************************************************************************
  // Data
  //****************************************************************************

  /**
   * Get all Datasets for the specified project.
   * @param {Object} project The project for which to fetch data.
   * @return {null} List of Datasets is placed on scope and appropriate
   * template is selected.
   */
  $scope.getDatasets = function(project){
    $scope.dataIsLoading = true;
    $scope.selectedProject = project;

    $location.search({
      project: project,
      count: $location.search().count,
      page: $location.search().page
    });

    return $http.get('/api/data/'+project).then(function(response){
      $timeout(function(){
        setProperty(response.data, 'organism');
        $scope.table = new NgTableParams(tableParameters, {data: response.data});
        $scope.active = 'DATASET';
        $scope.dataIsLoading = false;
      });
    }, function(error){
      $scope.dataIsLoading = false;
      console.log(error);
      //TODO: Show message
    });
  };

  /**
   * Get all ORF for the specified Project and Dataset.
   * @param {Object} project The project for which to fetch data.
   * @param {Object} dataset The dataset for which to fetch data.
   * @return {null} List of ORF is placed on scope and appropriate
   * template is selected.
   */
  $scope.getOrfs = function(project, dataset){
    $scope.dataIsLoading = true;
    $scope.selectedDataset = dataset;
    $scope.selectedProject = project;

    $location.search({
      project: project,
      dataset: dataset,
      count: $location.search().count,
      page: $location.search().page
    });

    $http.get('/api/data/'+$scope.selectedProject+'/dataset/'+dataset).then(function(response){

      $timeout(function(){
        dataSort(response.data);

        $scope.table = new NgTableParams(tableParameters, {data: response.data});
        $scope.active = 'ORF';
        $scope.dataIsLoading = false;
      });

    }, function(error){
      $scope.dataIsLoading = false;
      console.log(error);
      //TODO: Show message
    });
  };

  /**
   * Get all Projects.
   * @return {null} List of Projects is placed on scope and appropriate
   * template is selected.
   */
  function getProjects() {
    Datatree.getProjectList().then(function(response){
      $scope.dataIsLoading = true;
      $timeout(function(){
        $scope.table = new NgTableParams(tableParameters, {data: response.data});
        $scope.active = 'PROJECT';
        $scope.dataIsLoading = false;
      });
    }, function(error){
      $scope.dataIsLoading = false;
      console.log(error);
      //TODO: Show message
    });
  }

  /**
   * Reset to project selection.
   * @return {null}
   */
  $scope.reset = function(){
    $scope.active = 'NONE';
    $scope.selectedDataset = undefined;
    $scope.selectedProject = undefined;
    $location.search({
      count: $location.search().count,
      page: 1
    });
  };

  /**
   * Reset to dataset selection.
   * @return {null}
   */
  $scope.resetToProject = function(){
    $scope.selectedDataset = undefined;
    $scope.active = 'NONE';
    $location.search({
      project: $scope.selectedProject,
      count: $location.search().count,
      page: 1
    });
  };

  /**
   * Watch for change in location search. These changes can be:
   *    - count: number of rows displayed in table
   *    - page: active page in the table
   *    - project: the project for which to display Datasets
   *    - dataset: the dataset for which to display ORFs
   * @return {null}
   */
  $scope.$watch(function(){return $location.search();}, function(nv, ov){
    if(nv){
      //Set for if table is not yet generated
      tableParameters.count = Number(nv.count||10);
      tableParameters.page = Number(nv.page||1);
      if($scope.table){
        //Set for if table is already present
        $scope.table.count(Number(nv.count||10));
        $scope.table.page(Number(nv.page||1));
      }
      if(nv.project){
        // Prevent data from being loaded multiple times with digest cycles.
        if(ov.project !== nv.project || pageLoad || ov.dataset !== nv.dataset){
          if(nv.dataset){
            $scope.getOrfs(nv.project, nv.dataset);
          }else{
            $scope.getDatasets(nv.project);
          }
          pageLoad = false;
        }
      }else{
        // If no project is specified, fetch all projects.
        $scope.selectedDataset = undefined;
        $scope.selectedProject = undefined;
        getProjects();
      }
    }
  });

  /**
   * Watch for change in table settings by user and apply them on location search.
   * Setting: count
   * @return {null}
   */
  $scope.$watch(function(){return $scope.table?$scope.table.count():undefined;}, function(nv){
    var search = $location.search();
    search.count = nv?nv:search.count;
    $location.search(search);
  });
  /**
   * Watch for change in table settings by user and apply them on location search.
   * Setting: page
   * @return {null}
   */
  $scope.$watch(function(){return $scope.table?$scope.table.page():undefined;}, function(nv){
    var search = $location.search();
    search.page = nv?nv:search.page;
    $location.search(search);
  });


  //****************************************************************************
  // Analyses
  //****************************************************************************
  $scope.analysisClass = function (analysisState, outcome){
    if(outcome !== undefined){
      return {
        'glyphicon-remove text-muted': !analysisState,
        'glyphicon-plus text-success': analysisState && outcome,
        'glyphicon-minus text-danger': analysisState && !outcome
      };
    }else{
      return {
        'glyphicon-remove text-muted': !analysisState,
        'glyphicon-ok text-info': analysisState,
      };
    }
  };

  //****************************************************************************
  // Settings
  $scope.settings = {
    isOpen: false,
    toggle: function (){$scope.settings.isOpen = !$scope.settings.isOpen;}
  };

  //****************************************************************************
  // Disopred
  $scope.disopredThreshold = 0.01;

  // Disopred outcomeFunction
  $scope.disopredIsPositive = function(row){
    if(row.analysis.disopred){
      if(row.analysis.disopred.data.discrete.percentAboveThreshold > $scope.disopredThreshold*100){
        row._DISOPRED = 2;
        return true;
      }else{
        row._DISOPRED = 1;
        return false;
      }
    }else{
      row._DISOPRED = 0;
      return false;
    }
    $scope.$apply();
  };

  //****************************************************************************
  // TMHMM
  $scope.tmhmm = {
    TMH: {
      checked: false,
      value: 0
    },
    AAInTMH: {
      checked: true,
      value: 18
    },
    AAFirst60: {
      checked: true,
      value: 10
    },
  };

  // Disopred outcomeFunction
  $scope.tmhmmIsPositive = function(row){
    if(row.analysis.tmhmm){
      var r = row.analysis.tmhmm.data.discrete;
      var res =  (!$scope.tmhmm.TMH.checked || r.numberPredictedTMH >= $scope.tmhmm.TMH.value) &&
      (!$scope.tmhmm.AAInTMH.checked || r.expectedNumberAAInTMH >= $scope.tmhmm.AAInTMH.value) &&
      (!$scope.tmhmm.AAFirst60.checked || r.expectedNumberAAFirst60 <= $scope.tmhmm.AAFirst60.value);
      if(res){
        row._TMHMM = 2;
        return true;
      }else{
        row._TMHMM = 1;
        return false;
      }
      return res;
    }else{
      row._TMHMM = 0;
      return false;
    }
    $scope.$apply();
  };

});
