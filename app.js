
var app = angular.module('map', ['google-maps'.ns(), 'ui.router']);

  app.config(['GoogleMapApiProvider'.ns(), '$stateProvider', '$urlRouterProvider', function (GoogleMapApi, $stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/findPlace');

    $stateProvider
      .state('findPlace', {
        url: '/findPlace',
        template: '<div>findPlace</div>' +
        '<div id="map_canvas">' +

    '<script type="text/ng-template" id="searchbox.tpl.html">' +
      '<input id="pac-input" class="controls" type="text" placeholder="Search Box"></input>' +
    '</script>' +

    '<script type="text/ng-template" id="control.tpl.html">' +
        '<button class="btn" ng-click="controlClick()">{{controlText}}</button>' +
    '</script>' +

        '<ui-gmap-google-map center="map.center" zoom="map.zoom" draggable="true" options="options">' +
      '<ui-gmap-search-box template="searchbox.template" position="searchbox.position" events="searchbox.events">' +
      '</ui-gmap-search-box>' +
      
      '<ui-gmap-map-control template="control.tpl.html" position="top-left" controller="customController" index="-1"></ui-gmap-map-control>' +
      
      '<ui-gmap-marker coords="marker.coords" options="marker.options" idkey="marker.id">' +
      '</ui-gmap-marker>' +
    '</ui-gmap-google-map>' +
    '</div>',
        controller: 'mapController'
        // templateUrl: '/partials/findPlace.html'
      })
      .state('savedList', {
        url: '/savedList',
        template: '<div>savedList</div>'
        // templateUrl: '/partials/savedList.html'
      })
      .state('searchHistory', {
        url: '/searchHistory',
        template: '<div>searchHistory</div>'
        // templateUrl: '/partials/searchHistory.html'
      });

    GoogleMapApi.configure({
        // key: 'your api key',
        v: '3.17',
        libraries: 'weather,geometry,visualization,places',
        sensor: 'false'
    });

  }]).controller('mapController', ['$scope', 'GoogleMapApi'.ns(), 'Data', function($scope, GoogleMapApi, Data){
    // do stuff with scope
    var getLoc = {
      places_changed: function(data){
        Data.searched = Data.searched || true;
        console.log('Data1', Data);
        var places = data.getPlaces();
        console.log('places1', places[0]);
        var latitude = places[0].geometry.location.k;
        var longitude = places[0].geometry.location.B;
        $scope.map.center = {latitude: latitude, longitude: longitude};
        $scope.marker.coords = {latitude: latitude, longitude: longitude};
        $scope.marker.info = places[0];
        places[0].date = new Date();
        console.log('places2', places[0]);
        Data.searchHistory.push(places[0]);
        Data.marker = $scope.marker.info;
        console.log('$scope1', $scope);
      }
    };
    $scope.map = {center: {latitude: 51.219053, longitude: 4.404418 }, zoom: 14 };
    $scope.options = {scrollwheel: false};
    $scope.searchbox = {template:'searchbox.tpl.html', position:'top-left', events: getLoc};
    $scope.marker = {
      id: 0,
      coords: $scope.map.center,
      options: {
        draggable: false
      }
    };

      GoogleMapApi.then(function(maps){

      });
    }
  ]);

  app.controller('customController', ['$scope', 'GoogleMapApi'.ns(), 'Data', function($scope, GoogleMapApi, Data){
    $scope.controlText = 'save the marker to the list';
    $scope.controlClick = function(){
      console.log('Data2', Data);
      console.log('_.some', _.some(Data.savedList, function(item){
        return item.id === Data.marker.id
      }));
      if(Data.searched && !_.some(Data.savedList, function(item){
        return item.id === Data.marker.id
      })){
        Data.savedList.push(Data.marker);
      }else{
        console.log('already in the list')
        // show "already in the list"
      }
      console.log('Data.savedList', Data.savedList);
    };
  }]);

  app.factory('Data', function(){
    return {searched: false, savedList: [], searchHistory: [], marker:{}};
  });
