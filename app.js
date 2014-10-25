
angular.module('map', ['google-maps'.ns()])
  .config(['GoogleMapApiProvider'.ns(), function (GoogleMapApi) {
    GoogleMapApi.configure({
        // key: 'your api key',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
  }]).controller('mapController',['$scope', 'GoogleMapApi'.ns(), function($scope, GoogleMapApi){
    // do stuff with scope
    $scope.map = {center: {latitude: 51.219053, longitude: 4.404418 }, zoom: 14 };
    $scope.options = {scrollwheel: false};

      GoogleMapApi.then(function(maps){

      });
    }
  ]);
