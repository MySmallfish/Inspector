(function (S) {
    S.StateManager = function () {
        var state = {};
        function getContainer(id) {
            var container = state[id];
            if (!container) {
                state[id] = container = {};
            }
            return container;
        }

        function watch(container, name) {
            return function(newValue) {
                container[name] = newValue;
            }        
        }

        function register($scope, id, name) {
            var container = getContainer(id);
            $scope[name] = container[name];

            $scope.$watch(name, watch(container, name));

        }

        return {
            register: register
        };
    };
})(Simple);
