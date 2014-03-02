(function (S, SL) {

    SL.AppController = [
        "$scope",
        "$q",
        "textResource",
        "loginManager",
        "navigate",
        "network",
        function ($scope, $q, textResource, loginManager, navigate, network) {
            var anonymousAllowed = ["views/login.html", "views/configuration.html"];
            function stop() {
                event.stopPropagation();
            };

            function setHeader(key) {
                return function () {
                    $scope.changeHeader(textResource.get(key));
                };
            }

            $scope.$on("Simple.RequestAuthorizationFailed", logout);
            function logout() {
                onProgressStarted();
                loginManager.logout().then(function () {
                    navigate.login();
                    onProgressCompleted();
                });
            };

            function onRouteChangeStart(event, next, current) {
                loginManager.isUserLoggedIn().then(function () {
                    $scope.isLoggedIn = true;
                }, function () {
                    $scope.isLoggedIn = false;
                    // no logged user, we should be going to #login
                    if (anonymousAllowed.indexOf(next.templateUrl) >= 0) {
                        // already going to #login, no redirect needed
                    } else {
                        // not going to #login, we should redirect now
                        navigate.login();
                    }
                });
            }

            function changeHeader(header) {
                $scope.header = header;
                return $q.when(header);
            }

            function onNetworkStatusChanged() {
                $scope.isOnline = network.isOnline();
            }

            function onProgressStarted() {
                $scope.isInProgress = true;
            }

            function onProgressCompleted() {
                $scope.isInProgress = false;
            }

            function notifyProgressStarted(context) {
                
                $scope.$root.$broadcast("progress-started");
                $scope.$root.isInProgress = true;
                return $q.when(context);
            }

            function notifyProgressCompleted() {
                $scope.$root.isInProgress = false;
                $scope.$root.$broadcast("progress-completed");
            }

            function navigateToConfiguration() {
                navigate.configuration();
            }

            function refresh() {
                $scope.$root.$broadcast("SimplyLog.RefreshRequired");
            }

            
            function onRouteChangeSuccess(event, next) {
                changeHeader("");
                if (next && next.locals) {
                    $scope.$root.pageInfo = next.locals.pageInfo;
                }
            }

            function bind(name, handler) {
                $scope.$root.$on(name, handler);
            }

            function bindEvents() {
                bind("Simple.NetworkStatusChanged", onNetworkStatusChanged);
                bind("progress-started", onProgressStarted);
                bind("progress-completed", onProgressCompleted);
                bind("$routeChangeSuccess", onRouteChangeSuccess);
                bind("$routeChangeStart", onRouteChangeStart);
            }


            _.extend($scope, {
                changeHeader: changeHeader,
                setHeader: setHeader,
                stop: stop,
                logout: logout,
                navigateToConfiguration: navigateToConfiguration,
                refresh: refresh,
                notifyProgressStarted: notifyProgressStarted,
                notifyProgressCompleted: notifyProgressCompleted
            });

            onNetworkStatusChanged();
            bindEvents();


        }];

})(Simple, SimplyLog);