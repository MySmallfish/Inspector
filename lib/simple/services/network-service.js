(function (S) {

    S.NetworkService = function ($rootScope, $window, safeApply) {
        var simulatedValue = null;

        function isOnline() {
            return simulatedValue !== null ? simulatedValue : navigator.onLine;
        }

        function onNetworkStatusChanged() {
            $rootScope.$broadcast("Simple.NetworkStatusChanged", { online: isOnline() });
        }

        function raiseChangeStatusEvent() {
            safeApply($rootScope,function () {
                onNetworkStatusChanged();
            });
        }

        $window.addEventListener("offline", raiseChangeStatusEvent, false);
        $window.addEventListener("online", raiseChangeStatusEvent, false);

        function simulate(online) {
            simulatedValue = online;

            raiseChangeStatusEvent();
        }

        function simulateOffline() {
            simulate(false);
        }

        function simulateOnline() {
            simulate(true);
        }

        function clearSimulation() {
            simulate(null);
        }

        function isSimulated() {
            return simulatedValue === null;
        }

        return {
            isOnline: isOnline,
            simulateOffline: simulateOffline,
            simulateOnline: simulateOnline,
            clearSimulation: clearSimulation,
            isSimulated: isSimulated
        };

    };

})(Simple);