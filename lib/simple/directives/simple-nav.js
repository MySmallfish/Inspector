(function (S) {
    S.BackDirective = function($window){
        return {
            restrict: "A",
            link: function (scope, element, attrs) {
                $(element[0]).on('click', function (event) {
                    event.preventDefault();
                    $window.history.back();
                    scope.$apply();
                });
            }
        };
    };

    S.HomeDirective = function ($location) {
        return {
            restrict: "A",
            link: function (scope, element, attrs) {
                $(element[0]).on('click', function (event) {
                    event.preventDefault();
                    $location.path("/");
                    scope.$apply();
                });
            }
        };
    };
})(Simple);
