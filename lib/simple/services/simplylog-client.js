(function (S) {
    S.SimplyLogClientProvider = function () {
        var userCredentials;

        return {
            configure: function (config) {
                userCredentials = {
                    userName: config.userName,
                    password: config.password
                }
            },
            $get: ["$http", function ($http) {
                return new S.SimplyLogClient(userCredentials, $http);
            }]
        }
    };

    S.SimplyLogClient = function (credentials, $http) {

        if (!credentials) {
            throw Error("Credentials were not configured.");
        }

        function authenticate(tenant) {
            return $http({
                url: "https://simplylogapi.ylm.co.il/api/token",
                data: {
                    "grant_type": "password",
                    "username": credentials.userName,
                    "password": credentials.password,
                    "tenant": tenant
                },
                headers: {
                    "Authorization": "Bearer MzY5YzVkM2MtNmIxMS00YTFhLTk3YWUtMWM0OWMyZTYyYTY0OkhnSlFPSE82amdZT1JrRFlVRjVsUWI1dll2WE9PaHM3V2JHMG10RjkwSFE9",
                },
                method: "POST"
            }).then(function(response) {
                return response.data.access_token;
            });
        }

        return {
            reportIncident: reportIncident
        };

        function reportIncident(tenant, parameters) {
            
            return authenticate(tenant).then(function(token) {
                return $http({
                    url: "https://simplylogapi.ylm.co.il/api/Events",
                    data: parameters,
                    headers: {
                        "Authorization": "Bearer " + token,
                        "Content-Type": "application/json; charset=utf-8"
                    },
                    method: "POST"
                }).then(function(response) {
                    return response.data;
                });
            });
        }

    };

})(Simple);
