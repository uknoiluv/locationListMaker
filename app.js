
angular.module('map', ['google-maps'.ns()])
  .config(['GoogleMapApiProvider'.ns(), function (GoogleMapApi) {
    GoogleMapApi.configure({
        // key: 'your api key',
        v: '3.17',
        libraries: 'weather,geometry,visualization,places',
        sensor: 'false'
    });
  }]).controller('mapController',['$scope', 'GoogleMapApi'.ns(), function($scope, GoogleMapApi){
    // do stuff with scope
    var getLoc = {
      places_changed: function(data){
        var places = data.getPlaces();
        console.log('places', places);
        var latitude = places[0].geometry.location.k;
        var longitude = places[0].geometry.location.B;
        $scope.map.center = {latitude: latitude, longitude: longitude};
        $scope.marker.coords = {latitude: latitude, longitude: longitude};
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
