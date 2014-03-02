(function (S) {

    S.NetworkManager = function ($q,$rootScope, network) {
        var queuePromise, start = $q.defer();

        function initQ() {
            if (network.isOnline()) {
                start.resolve();
            } else {
                start = $q.defer();
            }

            queuePromise = start.promise;
        }

        function runOnline(func) {
            queuePromise = queuePromise.then(func);
        }

        $rootScope.$on("Simple.NetworkStatusChanged", function () {
            initQ();
        });

        initQ();

        return {
            runOnline: runOnline
        };
    };

})(Simple);