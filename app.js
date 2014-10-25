
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
    var x = {
      places_changed: function(data){
        console.log(data);
        console.log(data.getPlaces());
      }
    };
    $scope.map = {center: {latitude: 51.219053, longitude: 4.404418 }, zoom: 14 };
    $scope.options = {scrollwheel: false};
    $scope.searchbox = {template:'searchbox.tpl.html', position:'top-left', events: x};

      GoogleMapApi.then(function(maps){
        maps.event

      });
    }
  ]);
