(function (S) {
    S.AzureActiveDirectoryProvider = function() {
        var storedAuthSettings, 
            azureTenant,
            azureDirectoryUrl = "https://login.windows.net";
        return {
            configure: function(tenant, authSettings) {
                storedAuthSettings = authSettings;
                azureTenant = tenant;
            },
            $get: [
                "$http","configurationManager", function($http, configurationManager) {

                    function buildUrl(op) {
                        //return "https://login.windows.net/fee5e6d8-9432-4272-b604-30cc3f7383b3/oauth2/token?api-version=1.0";
                        //return [azureDirectoryUrl, "common", op].join("/");
                        azureDirectoryUrl = configurationManager.get("Api.Address") + op;
                        return azureDirectoryUrl;
                    }

                    function authenticate(userName, password) {
                        var url = buildUrl("/api/Token");
                        console.log("UR:", url);
                        var auth = _.extend(storedAuthSettings, { username: userName + "@" + azureTenant, password: password });

                        return $http({
                            method: "POST",
                            url: url,
                            data: auth,
                            headers: {
                                "Authorization": "Bearer MzY5YzVkM2MtNmIxMS00YTFhLTk3YWUtMWM0OWMyZTYyYTY0OkhnSlFPSE82amdZT1JrRFlVRjVsUWI1dll2WE9PaHM3V2JHMG10RjkwSFE9"
                            }
                        }).then(function (authInfo) {
                            authInfo = authInfo.data;
                            return $http({
                                method: "GET",
                                url: buildUrl("/api/User"),
                                headers: {
                                    "Authorization": authInfo.token_type + " " + authInfo.access_token
                                }
                            }).then(function(userInfo) {
                                return { user: userInfo.data, token: authInfo };
                            });
                        });
                    }

                    return {
                        authenticate: authenticate
                    };

                }
            ]
        };
    };


})(Simple);