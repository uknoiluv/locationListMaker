//Location List Maker 

describe('Location List Maker', function(){
  

  // var googleMapApi;
  beforeEach(module('map'));
  // beforeEach(function() {
  //   // Here we create a fake module just to intercept and store the provider
  //   // when it's injected, i.e. during the config phase.
  //   angular.module('dummyModule', function() {})
  //     .config(['GoogleMapApiProvider'.ns(), function(GoogleMapApi) {
  //       GoogleMapApi.configure({
  //         // key: 'your api key',
  //         v: '3.17',
  //         libraries: 'weather,geometry,visualization,places',
  //         sensor: 'false'
  //       });
  //       googleMapApi = GoogleMapApi;
  //     }]);

  //   module('map', 'dummyModule');

  //   // This actually triggers the injection into dummyModule
  //   inject(function(){});
  // });
/**/
  // beforeEach(function() {
  //   return this.googleTemp = window.google;
  // });

  // afterEach(function() {
  //   return window.google = this.googleTemp;
  // });
/**/


  describe('when Data service is used', function(){

    var data;

    beforeEach(inject(function(_Data_){
      data = _Data_;
    }));
       
    it('should be true for searched property', function(){
      expect(data.searched).to.equal(false);
    });

    it('should be default value for defaultLoc property', function(){
      expect(data.defaultLoc.latitude).to.equal(34.440009);
      expect(data.defaultLoc.longitude).to.equal(-119.738670);
    });

    it('should be empty array for savedList property and searchHistory property', function(){
      expect(data.savedList.length).to.equal(0);
      expect(data.searchHistory.length).to.equal(0);
    });

    it('should be empty object for marker', function(){
      expect(_.isEmpty(data.marker)).to.equal(true);
    });

  });

  describe('when map controller is used', function(){

    var scope;
    var ctrl;
  
    beforeEach(inject(function($rootScope, $controller, _Data_) {
      scope = $rootScope.$new();
      data = _Data_;
      // googleMapApi = _GoogleMapApi_;
      // console.log('googleMapApi', googleMapApi);
      // console.log('this', this);
      ctrl = $controller('mapController', {$scope: scope, _Data_: data}); 
    }));

    it('should have an initial property and values', function(){
      expect(scope.map.zoom).to.equal(14);
      expect(typeof scope.map.center).to.equal('object');
      expect(scope.map.center.latitude).to.equal(34.440009);
      expect(scope.map.center.longitude).to.equal(-119.738670);
    });

    describe('when getLocation function is called', function(){
      
      beforeEach(function(){
        scope.searchbox.events.places_changed({getPlaces: function(){
            return [{geometry: {location: {k: 1, B:1 }}}];
          }
        });
      });
   
      it('should be a function', function(){
        expect(typeof scope.searchbox.events.places_changed).to.equal('function');
        // expect(typeof scope.map.center).to.equal('object');
        // expect(scope.map.center.latitude).to.equal(34.440009);
        // expect(scope.map.center.longitude).to.equal(-119.738670);
        // expect(scope.options.scrollwheel).to.equal(false);
      });

      afterEach(function(){
        expect(data.searched).to.equal(true);
        expect(scope.marker.coords.latitude).to.equal(1);
        expect(scope.marker.coords.longitude).to.equal(1);

        // expect(_.isEqual(scope.marker.info, {geometry: {location: {k: 1, B:1 }}})).to.equal(true);
      });
    });

  });

  describe('when custom controller is used', function(){

    var scope;
    var ctrl;
    var timeout;
  
    beforeEach(inject(function($rootScope, $controller, _Data_, $timeout) {
      scope = $rootScope.$new();
      data = _Data_;
      timeout = $timeout;
      console.log('this', this);
      ctrl = $controller('customController', {$scope: scope, _Data_: data, $timeout: timeout}); 
      console.log('data', data);
      data.searched = true;
      data.marker.geometry = {location: {k: 1, B:1 }};
      scope.controlClick();
    }));

    it('should be a string / should wait for 600ms / savedList length should be greater than 0', function(){
      expect(typeof scope.controlText).to.equal('string');
      // expect(typeof scope.searchbox.events.places_changed).to.equal('function');
    });

    afterEach(function(){
      timeout(function(){
        expect(scope.controlText === 'Save the marker to the list').to.equal(true);
      }, 700)
      
      expect(data.savedList.length > 0).to.equal(true);

    });
  });


  describe('when savedList controller is used', function(){

    var scope;
    var ctrl;
  
    beforeEach(inject(function($rootScope, $controller, _Data_) {
      scope = $rootScope.$new();
      data = _Data_;
      data.savedList = [{geometry: {location: {k:45, B: 45}}}, {geometry: {location: {k: 55, B: 55}}}];
      ctrl = $controller('savedListController', {$scope: scope, _Data_: data}); 
    }));

    it('should be 50, 50 for center', function(){
      expect(scope.map.center.latitude).to.equal(50);
      expect(scope.map.center.longitude).to.equal(50);
    });

    it('zoom should be calculated', function(){
      expect(typeof scope.map.zoom).to.equal('number');
    });

  });


  describe('when searchHistory controller is used', function(){

    var scope;
    var ctrl;
  
    beforeEach(inject(function($rootScope, $controller, _Data_) {
      scope = $rootScope.$new();
      data = _Data_;
      ctrl = $controller('searchHistoryController', {$scope: scope, _Data_: data}); 
      data.searchHistory = []
    }));

    it('searchHistory should have Data directive\'s searchHistory value', function(){
      expect(Array.isArray(scope.list)).to.equal(true);
    });
  
  });


  describe('savedInlist directive', function() {

    var element;
    var outerScope;
    var innerScope;

    beforeEach(inject(function($rootScope, $compile) {
      element = angular.element('<saved-inlist class="btn" ng-click="controlClick()">{{controlText}}</button><div class="msg">{{msg}}</div>');
      console.log('element', element);
      outerScope = $rootScope;
      $compile(element)(outerScope);

      innerScope = element.isolateScope();

      outerScope.$digest();
    }));
    
    describe('msg', function() {
      beforeEach(function() {
        outerScope.$apply(function() {
          outerScope.msg = 'changed';
        });
      })

      it('should be rendered', function() {
        console.log('element[1]', element[0]);
        expect(element[0].children[0].innerHTML).to.equal('changed');
      });
    });

    
    describe('click callback', function() {
      var mySpy;

      beforeEach(function() {
        console.log('sinon', sinon);
        mySpy = sinon.spy();
        outerScope.$apply(function() {
          outerScope.controlClick = mySpy;
        });
      });

      describe('when the directive is clicked', function() {
        beforeEach(function() {
          element[0].click();
        });

        it('should be called', function() {
          expect(mySpy.callCount).to.equal(1);
        });
      });
    });

  });


});


