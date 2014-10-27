
var app = angular.module('map', ['google-maps'.ns(), 'ui.router']);

  app.config(['GoogleMapApiProvider'.ns(), '$stateProvider', '$urlRouterProvider', function (GoogleMapApi, $stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/findPlace');

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
        controller: 'mapController'
      })
      .state('savedList', {
        url: '/savedList',
        template: '<div id="map_canvas" class="savedListMap">' +
          '<ui-gmap-google-map center="map.center" zoom="map.zoom" draggable="true" options="options">' +
          '<ui-gmap-markers models="list" coords="\'coords\'" options="\'labelInfo\'">' +
          '</ui-gmap-markers>' +
          '</ui-gmap-google-map>' +
          '<div class="savedList">' +
          '<ul><li class="savedListItem" ng-repeat="item in list">' + 
          '{{$index + 1}} {{item.formatted_address}}' +   
          '</li></ul></div>' +
          '</div>',
        controller: 'savedListController'
      })
      .state('searchHistory', {
        url: '/searchHistory',
        template: '<div class="searchHistory">' +
          '<ul><li ng-repeat="item in list">' + 
          '[{{$index + 1}}] {{item.formatted_address}} {{item.date | date:"medium"}}'  +   
          '</li></ul>' +
          '</div>',
        controller: 'searchHistoryController'
      });

    GoogleMapApi.configure({
        v: '3.17',
        libraries: 'weather,geometry,visualization,places',
        sensor: 'false'
    });

  }]);
