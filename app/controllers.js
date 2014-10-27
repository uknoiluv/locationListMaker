
app.controller('mapController', ['$scope', 'GoogleMapApi'.ns(), 'Data', function($scope, GoogleMapApi, Data){
  var getLoc = {
    places_changed: function(data){
      Data.searched = Data.searched || true;
      var places = data.getPlaces();
      var latitude = places[0].geometry.location.k;
      var longitude = places[0].geometry.location.B;
      $scope.map.center = {latitude: latitude, longitude: longitude};
      $scope.marker.coords = {latitude: latitude, longitude: longitude};
      $scope.marker.info = places[0];
      places[0].date = new Date();
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
}]);


app.controller('customController', ['$scope', 'GoogleMapApi'.ns(), 'Data', '$timeout',function($scope, GoogleMapApi, Data, $timeout){
  var msg = 'Save the marker to the list';
  $scope.controlText = msg;
  $scope.msg = '';
  $scope.controlClick = function(){
    if(Data.searched && !_.some(Data.savedList, function(item){
      return item.id === Data.marker.id
    })){
      Data.marker.coords = {latitude: Data.marker.geometry.location.k, longitude: Data.marker.geometry.location.B}
      Data.marker.labelInfo = {labelContent: Data.marker.formatted_address, labelClass: 'labelContent'};
      Data.savedList.push(Data.marker);
      $scope.controlText = 'saved';
    }else if(Data.searched){
      $scope.controlText = 'already in the list';
    }
    $timeout(function(){
      $scope.controlText = msg;
    }, 600);
  };
}]);

app.controller('savedListController', ['$scope', 'GoogleMapApi'.ns(), 'Data', function($scope, GoogleMapApi, Data){
  $scope.list = Data.savedList;
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
  var GLOBE_WIDTH = 256; 
  var angleLon = bounds.northeast.longitude - bounds.southwest.longitude;
  var angleLat = bounds.northeast.latitude - bounds.southwest.latitude;
  angleLon < 0 ? angleLon += 360 : null;
  angleLat < 0 ? angleLat += 180 : null;
  var angle = angleLon > angleLat ? angleLon : angleLat;
  angleLon === 0 && angleLat === 0 ? angle = 0.01: null;
  var zoom = Math.round(Math.log(300 * 360 / angle / GLOBE_WIDTH) / Math.LN2);
  $scope.map = {bounds: bounds, center: center, zoom: zoom};
  $scope.options = {scrollwheel: false};
}]);

app.controller('searchHistoryController', ['$scope', 'GoogleMapApi'.ns(), 'Data', function($scope, GoogleMapApi, Data){
  $scope.list = Data.searchHistory;
}]);
