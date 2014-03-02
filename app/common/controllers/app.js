(function (S, I) {
    I.AppController = [
            "$scope",
            "$q",
            "$window",
            "textResource",
            "loginManager",
            "$location",
            "network",
            function ($scope, $q, $window, textResource, loginManager, $location, network) {
                var anonymousAllowed = ["views/login.html", "views/configuration.html"];
                var navigateToLogin = function() {
                    $location.path("/Login");
                };

                function stop() {
                    event.stopPropagation();
                };

                function setHeader(info) {
                    return function () {
                        $scope.changeHeader(info);
                    };
                }

                $scope.$on("Simple.RequestAuthorizationFailed", logout);
                function logout() {
                    onProgressStarted();
                    loginManager.logout().then(function () {
                        navigateToLogin();
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
                            navigateToLogin();
                        }
                    });
                }

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
                    bind("$routeChangeStart", onRouteChangeStart);
                }

                function logError(e) {
                    console.error("Uncaught Error", e);
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