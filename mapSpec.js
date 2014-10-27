
// test
describe('Location List Maker factory', function(){
  
  // console.log('app', app);

  beforeEach(module('map'));

  var data;

  beforeEach(inject(function(_Data_){
    data = _Data_;
  }));

  describe('when invoked', function(){
    
    // beforeEach(function(){
    //   var dataInside = data();
    // });
   
    it('should be values for properties', function(){
      expect(data.searched).to.equal(false);
    });

  });

  // it('describe module' ,function(){

  // });

});
