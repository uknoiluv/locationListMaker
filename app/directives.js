
// app.directive('savedInlist', function(){
(function(){

  var linkFunc = function(){
    return {
      link: function(scope, element, attr){
        scope.$watch('controlText', function(newValue, oldValue){
          if(newValue === 'saved'){
            element.css('background-color', '#000066');
          }else if(newValue === 'already in the list'){
            element.css('background-color', '#FF3399');
          }else{
            element.css('background-color', '#0099CC');
          }
        }, true);
      }
    };
  };

  angular
    .module('map')
    .directive('savedInlist', linkFunc);

})();
