'use strict';

angular.module('proteoWebApp')
  .service('Comparison', function ($location) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    /**
     * Maximum number of ORF to be selected.
     */
    var MAXSEL = 2;

    /**
     * If selection is active.
     */
    var active = false;

    /**
     * The selected objects.
     */
    var sel = [];

    /**
     * Model to verify if checkbox is checked.
     * TODO: this was added because the ng-checked property on the md-checkbox
     * element behaves weirdly.
     */
    this.selected = {};

    /**
     * Formats an ORF path.
     * @param {Object} orf An ORF.
     * @return {String} The path to the ORF.
     */
    function orfToPath (orf) {
      return '/'+orf.project.name+'/'+orf.dataset.name+'/'+orf.name;
    }

    /**
     * Status getter functions.
     * @return {Boolean} The requested status.
     */
    this.isActive = function(){return active;};
    this.isLacking = function(){return sel.length < MAXSEL && active;};
    this.isGood = function(){return sel.length === MAXSEL && active;};
    this.isOver = function(){return sel.length > MAXSEL && active;};

    /**
     * Click function, activates the selection process or redirects when ready.
     * @return {null}
     */
    this.click = function(){
      if(!active){
        active = true;
      }else if(this.isGood()){
        $location.url('/orf/comparison'+orfToPath(sel[0])+orfToPath(sel[1]));
      }
    };

    /**
     * Getter for the selection button text.
     * @return {String} Text to be displayed.
     */
    this.text= function(){
      if(!active){
        return 'Compare';
      }else if(this.isLacking()){
        return sel.length + ' of '+ MAXSEL + ' selected';
      }
      else if(this.isGood()){
        return 'Compare '+sel.length;
      }
      else if(this.isOver()){
        return 'Too many selected';
      }
    };

    /**
     * Add an ORF to the selection.
     * @param {Object} orf An ORF.
     * @return {null}
     */
    this.add = function(obj){
      if(_.find(sel, {_id: obj._id}) === undefined){
        sel.push(obj);
      }else{
        _.remove(sel, {_id: obj._id});
      }
    };

    /**
     * Reset the selection process.
     * @return {null}
     */
    this.cancel = function(){
      active = false;
      sel = [];
      this.selected = {};
    };

  });
