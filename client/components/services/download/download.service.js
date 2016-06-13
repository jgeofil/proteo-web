'use strict';

angular.module('proteoWebApp')
  .service('Download', function ($http, $window, FileSaver) {

    /**
     * Gets url with authentication headers and creates a Blob.
     * @param {String} url Url to the resource.
     * @param {String} type Datatype of the resource.
     * @return {Object} Promise.
     */
    var getAndBlob = function(url, type){
      return $http.get(url, {responseType: 'arraybuffer'}).then(function(res){
        return new Blob([res.data], {type: type});
      });
    };

    /**
     * Gets url with authentication headers and creates a local link to the data.
     * @param {String} url Url to the resource.
     * @param {String} type Datatype of the resource.
     * @return {Object} Promise.
     */
    this.getLink = function(url, type){
      return getAndBlob(url, type).then(function(blob){
        return ($window.URL || $window.webkitURL).createObjectURL(blob);
      });
    };

    /**
     * Gets url with authentication headers and triggers the download of the data.
     * @param {String} url Url to the resource.
     * @param {String} type Datatype of the resource.
     * @param {String} filname Filename.
     * @return {null}
     */
    this.triggerDownloadFromUrl = function(url, type, filename){
      getAndBlob(url, type).then(function(blob){
        FileSaver.saveAs(blob, filename);
      });
    };

    /**
     * Triggers the download of the blob data.
     * @param {Blob} blob Blob data to download.
     * @param {String} filname Filename.
     * @return {null}
     */
    this.triggerDownloadFromData = function(data, type, filename){
      var blob = new Blob([data], { type: type });
      FileSaver.saveAs(blob, filename);
    };

  });
