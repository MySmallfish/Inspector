(function (S, SL) {

    SL.IncidentDetailsDirective = [
        function() {
            return {
                restrict: 'E',
                templateUrl: 'lib/simplylog/directives/incident-details/incident-details.html',
                scope: {
                    incident: "="
                },
                link: function(scope) {
                    // bind clicks...            
                }
            };
        }
    ];

})(Simple, SimplyLog);