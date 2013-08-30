(function(S){
	var sf = angular.module("Simple.Framework",[]);
	sf.directive("sfCommand", function(){
		return {
			restrict: "A",
			link: function(scope, element, attrs, ctrl){
				console.log(element, attrs);
			}
		}
	});
})(Simple);