(function (S, I) {
    I.AppController = [
            "$scope",
            "$q",
            "$window",
            "textResource",
            "loginManager",
            "$location",
            "network",
            "$log",
            function ($scope, $q, $window, textResource, loginManager, $location, network, $log) {

                $log.info("Loading application controller...");

                $scope.$on("Simple.RequestAuthorizationFailed", onRequestAuthorizationFailed);

                navigateToLogin();

                function navigateToLogin() {
                    $location.path("/Login");
                };

                function stop() {
                    event.stopPropagation();
                };

                function onRequestAuthorizationFailed(e) {
                    $log.log("Request authorization failed.", e);
                    logout();
                }

                function setHeader(info) {
                    return function () {
                        $scope.changeHeader(info);
                    };
                }

                
                function logout() {
                    onProgressStarted();
                    loginManager.logout().then(function () {
                        navigateToLogin();
                        onProgressCompleted();
                    });
                };

                function changeHeader(info) {
                    if (typeof info == "string") {
                        info = { header: info };
                    }
                    
                    _.extend($scope, {
                        header: textResource.get(info.header),
                        commands: {
                            back: info.back,
                            home: info.home,
                            logout: info.logout
                        }
                    });
                    
                    return $q.when(info);
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
                    
                }

                function logError(e) {
                    $log.error("Uncaught Error", e);
                }

                function goBack() {
                    $window.history.back();
                };
                function goHome() {
                    $location.path("/");
                };

                _.extend($scope, {
                    changeHeader: changeHeader,
                    setHeader: setHeader,
                    stop: stop,
                    logout: logout,
                    navigateToLogin: navigateToLogin,
                    refresh: refresh,
                    notifyProgressStarted: notifyProgressStarted,
                    notifyProgressCompleted: notifyProgressCompleted,
                    logError: logError,
                    goBack: goBack,
                    goHome: goHome
                });

                onNetworkStatusChanged();
                bindEvents();


            }];


})(Simple, Simple.Inspector);