(function (S) {

    S.EntityManager = [
        "$rootScope",
        "$q",
        "$log",
        "configurationManager",
        "loginManager",
        function ($rootScope, $q, $log, configurationManager, loginManager) {
            var manager = null;
            function getEntityManager() {
                var result = $q.defer();

                if (!manager) {

                    var serverAddress = configurationManager.get("Api.Address");
                    var oldClient = OData.defaultHttpClient;

                    var myClient = {
                        request: function (request, success, error) {
                            loginManager.getAccessToken().then(function (token) {
                                request.headers.Authorization = "Bearer " + token;

                                return oldClient.request(request, success, function (e) {
                                    if (e.response.statusCode == 401 || e.response.statusCode == 403) {
                                        $rootScope.$broadcast("Simple.RequestAuthorizationFailed", { code: e.statusCode, text: e.statusText });
                                    }
                                    error(e);
                                });
                            }, error);
                        }
                    };

                    OData.defaultHttpClient = myClient;

                    breeze.config.initializeAdapterInstances({
                        dataService: "OData"
                    });
                    manager = new breeze.EntityManager(serverAddress + "/odata");
                    resolve();

                } else {
                    resolve();
                }

                function fetchMetadata() {

                    if (manager.metadataStore.isEmpty()) {
                        manager.fetchMetadata().then(function (d) {
                            return d;
                        }, function (e) {
                            $log.error("Failed to fetch metadata", e.message);
                        });
                        return $q.when(manager.fetchMetadata());
                    }
                    return $q.when({});
                }

                function resolve() {
                    fetchMetadata().then(function () {
                        result.resolve(manager);
                    });
                }


                $rootScope.$on("Simple.ConfigurationChanged", function () {
                    manager = null;
                });

                return result.promise;
            }


            function queryEntityManager(query) {
                return getEntityManager().then(function (entityManager) {

                    return $q.when(entityManager.executeQuery(query)).catch(function (e) {
                        $log.error("Failed to execute query", e.message);
                        return e;
                    });
                });
            }

            function getByKey(entity, key, checkLocal) {
                return getEntityManager().then(function (entityManager) {
                    return entityManager.fetchEntityByKey(entity, key, checkLocal);
                });
            }

            return {
                get: getEntityManager,
                query: queryEntityManager,
                getByKey: getByKey
            };
        }];
})(Simple);
