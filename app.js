
var app = angular.module('map', ['google-maps'.ns(), 'ui.router']);

  app.config(['GoogleMapApiProvider'.ns(), '$stateProvider', '$urlRouterProvider', function (GoogleMapApi, $stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/findPlace');

    $stateProvider
      .state('findPlace', {
        url: '/findPlace',
        template: '<div>findPlace</div>'
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

  }]).controller('mapController',['$scope', 'GoogleMapApi'.ns(), function($scope, GoogleMapApi){
    // do stuff with scope
    var searched = false;
    var getLoc = {
      places_changed: function(data){
        console.log('searched1', searched);
        searched = true;
        var places = data.getPlaces();
        console.log('places1', places[0]);
        var latitude = places[0].geometry.location.k;
        var longitude = places[0].geometry.location.B;
        $scope.map.center = {latitude: latitude, longitude: longitude};
        $scope.marker.coords = {latitude: latitude, longitude: longitude};
        $scope.marker.info = places[0];
        places[0].date = new Date();
        console.log('places2', places[0]);
        $scope.searchHistory.push(places[0]);
        console.log('searched2', searched);
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
    $scope.searchHistory = [];
    $scope.savedList = [];
    $scope.controlText = 'save the marker to the list';
    $scope.controlClick = function(){
      if(searched && !$scope.savedList[$scope.marker.info.id]){
        $scope.savedList[$scope.marker.info.id] = $scope.marker.info;
      }else{
        // show "already in the list"
      }
    };

      GoogleMapApi.then(function(maps){

      });
    }
  ]);
