'use strict';

angular.module('proteoWebApp')
  .service('Comparison', function ($location) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var MAXSEL = 2;

    var active = false;


    function orfToPath (orf) {
      return '/'+orf.project.name+'/'+orf.dataset.name+'/'+orf.name;
    }

    this.isActive= function(){return active;};
    this.isLacking= function(){return this.selection.length < MAXSEL && active;};

    this.isGood= function(){return this.selection.length === MAXSEL && active;};
    this.isOver= function(){return this.selection.length > MAXSEL && active;};
    this.click= function(){
      if(!active){
        active = true;
      }else if(this.isGood()){
        $location.url('/orf/comparison'+orfToPath(this.selection[0])+orfToPath(this.selection[1]));
      }
    };

    this.selected = {};

    this.selection = [];

    this.text= function(){
      if(!active){
        return 'Compare';
      }else if(this.isLacking()){
        return this.selection.length + ' of '+ MAXSEL + ' selected';
      }
      else if(this.isGood()){
        return 'Compare '+this.selection.length;
      }
      else if(this.isOver()){
        return 'Too many selected';
      }
    };

    this.add = function(obj){
      if(_.find(this.selection, {_id: obj._id}) === undefined){
        this.selection.push(obj);
      }else{
        _.remove(this.selection, {_id: obj._id});
      }
    };

    this.cancel = function(){
      active = false;
      this.selection = [];
      this.selected = {};
    };

  });
