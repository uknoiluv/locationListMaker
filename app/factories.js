
(function(){

  var factoryFunc = function(){
    return {
      defaultLoc: {latitude: 34.440009, 
        longitude: -119.738670},
      searched: false, 
      savedList: [], 
      searchHistory: [], 
      marker:{}
    };
  };

  angular
    .module('map')
    .factory('Data', factoryFunc);

})();

