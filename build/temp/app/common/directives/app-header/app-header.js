(function (S, I) {

    I.AppHeaderDirective = [
        function() {
            return {
                restrict: 'E',
                templateUrl: 'app/common/directives/app-header/app-header.html',
                scope: true,
                link: function(scope) {
                    // bind clicks...            
                }
            };
        }];

})(Simple, Simple.Inspector);