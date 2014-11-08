(function(){
  'use strict';
  
  var findController = function($scope, GoogleMapApi, Data){
    var getLoc = {
      places_changed: function(data){
        var places = data.getPlaces();
        var latitude = places[0].geometry.location.k;
        var longitude = places[0].geometry.location.B;
        $scope.map.center = {latitude: latitude, longitude: longitude};
        $scope.marker.coords = {latitude: latitude, longitude: longitude};
        $scope.marker.info = places[0];
        places[0].date = new Date();
        Data.searched = Data.searched || true;
        Data.searchHistory.push(places[0]);
        Data.marker = $scope.marker.info;
      }
    };
    $scope.map = {center: Data.defaultLoc, zoom: 14 };
    $scope.options = {scrollwheel: false};
    $scope.searchbox = {template:'searchbox.tpl.html', position:'top-left', events: getLoc};
    $scope.marker = {
      id: 0,
      coords: $scope.map.center,
      options: {
        draggable: false
      }
    };    
  };


  angular
    .module('findPlace', [])
    .config(['$stateProvider', function($stateProvider){
      $stateProvider
        .state('findPlace', {
          url: '/findPlace',
          template: '<div id="map_canvas">' +
            '<script type="text/ng-template" id="searchbox.tpl.html">' +
            '<input id="pac-input" class="controls" type="text" placeholder="Type in location and choose from below"></input>' +
            '</script>' +
            '<script type="text/ng-template" id="control.tpl.html">' +
            '<button saved-inlist class="btn" ng-click="controlClick()">{{controlText}}</button><div class="msg">{{msg}}</div>' +
            '</script>' +
            '<ui-gmap-google-map center="map.center" zoom="map.zoom" draggable="true" options="options">' +
            '<ui-gmap-search-box template="searchbox.template" position="searchbox.position" events="searchbox.events">' +
            '</ui-gmap-search-box>' +
            '<ui-gmap-map-control template="control.tpl.html" position="top-left" controller="customController" index="-1"></ui-gmap-map-control>' +      
            '<ui-gmap-marker coords="marker.coords" options="marker.options" idkey="marker.id">' +
            '</ui-gmap-marker>' +
            '</ui-gmap-google-map>' +
            '</div>',
          controllerAs: 'find',
          controller: 'findController'
        });
    }])

    .controller('findController', [
      '$scope',
      'GoogleMapApi'.ns(),
      'Data',
      findController
    ]);

  // app.controller('mapController', ['$scope', 'GoogleMapApi'.ns(), 'Data', function($scope, GoogleMapApi, Data){
  // }]);

  var customController = function($scope, GoogleMapApi, Data, $timeout){
    var msg = 'Save the marker to the list';
    $scope.controlText = msg;
    $scope.msg = '';
    $scope.controlClick = function(){
      if(Data.searched && !_.some(Data.savedList, function(item){
        return item.id === Data.marker.id
      })){
        $scope.controlText = 'saved';
        Data.marker.coords = {latitude: Data.marker.geometry.location.k, longitude: Data.marker.geometry.location.B}
        Data.marker.labelInfo = {labelContent: Data.marker.formatted_address, labelClass: 'labelContent'};
        Data.savedList.push(Data.marker);
      }else if(Data.searched){
        $scope.controlText = 'already in the list';
      }
      $timeout(function(){
        $scope.controlText = msg;
      }, 600);
    };
  };

  angular
    .module('customButton', [])
    .controller('customController', ['$scope', 'GoogleMapApi'.ns(), 'Data', '$timeout', customController]);


  var savedList = function($scope, GoogleMapApi, Data){
    $scope.list = Data.savedList;
    var GLOBE_WIDTH = 256; 
    var findBound = function(){
      var northeast = {latitude: undefined, longitude: undefined};
      var southwest = {latitude: undefined, longitude: undefined};
      if(Data.savedList.length){
        for(var i = 0; i < Data.savedList.length; i++){
          var lat = Data.savedList[i].geometry.location.k;
          var lon = Data.savedList[i].geometry.location.B;
          !northeast.latitude || lat > northeast.latitude ? northeast.latitude = lat: null;
          !northeast.longitude || lon > northeast.longitude ? northeast.longitude = lon: null;
          !southwest.latitude || lat < southwest.latitude ? southwest.latitude = lat: null;
          !southwest.longitude || lon < southwest.longitude ? southwest.longitude = lon: null;
        }
        return {northeast: northeast, southwest: southwest};
      }else{
        northeast.latitude = Data.defaultLoc.latitude;
        northeast.longitude = Data.defaultLoc.longitude;
        southwest.latitude = Data.defaultLoc.latitude;
        southwest.longitude = Data.defaultLoc.longitude;
        return {northeast: northeast, southwest: southwest};
      }
    }
    var bounds = findBound();
    var center = {latitude: (bounds.northeast.latitude + bounds.southwest.latitude) / 2, longitude: (bounds.northeast.longitude + bounds.southwest.longitude) / 2};
    var mil = Math.pow(10, 4);
    center.latitude = Math.round(center.latitude * mil) / mil;
    center.longitude = Math.round(center.longitude * mil) / mil;
    var angleLon = bounds.northeast.longitude - bounds.southwest.longitude;
    var angleLat = bounds.northeast.latitude - bounds.southwest.latitude;
    angleLon < 0 ? angleLon += 360 : null;
    angleLat < 0 ? angleLat += 180 : null;
    var angle = angleLon > angleLat ? angleLon : angleLat;
    angleLon === 0 && angleLat === 0 ? angle = 0.01: null;
    var zoom = Math.round(Math.log(300 * 360 / angle / GLOBE_WIDTH) / Math.LN2);
    $scope.map = {bounds: bounds, center: center, zoom: zoom};
    $scope.options = {scrollwheel: false};
  }

  angular
    .module('savedList', [])
    .config(['$stateProvider', function($stateProvider){
      $stateProvider
        .state('savedList', {
          url: '/savedList',
          template:'<div id="map_canvas" class="savedListMap">' +
            '<ui-gmap-google-map center="map.center" zoom="map.zoom" draggable="true" options="options">' +
            '<ui-gmap-markers models="list" coords="\'coords\'" options="\'labelInfo\'">' +
            '</ui-gmap-markers>' +
            '</ui-gmap-google-map>' +
            '<div class="savedList">' +
            '<ul><li class="savedListItem" ng-repeat="item in list">' + 
            '{{$index + 1}} {{item.formatted_address}}' +   
            '</li></ul></div>' +
            '</div>',
          controllerAs: 'saved',
          controller: 'savedListController'
        });
    }])
    .controller('savedListController', ['$scope', 'GoogleMapApi'.ns(), 'Data', '$timeout', savedList]);


  var searchHistoryController = function($scope, GoogleMapApi, Data){
    $scope.list = Data.searchHistory;
  };

  angular
    .module('searchHistory', [])
    .config(['$stateProvider', function($stateProvider){
      $stateProvider
        .state('searchHistory', {
          url: '/searchHistory',
          template:'<div class="searchHistory">' +
            '<ul><li ng-repeat="item in list">' + 
            '[{{$index + 1}}] {{item.formatted_address}} {{item.date | date:"medium"}}'  +   
            '</li></ul>' +
            '</div>',
          controllerAs: 'search',
          controller: 'searchHistoryController'
        });
    }])
    .controller('searchHistoryController', ['$scope', 'GoogleMapApi'.ns(), 'Data', searchHistoryController]);


})();
