(function (S) {

    var simpleModule = angular.module("Simple", []);

    simpleModule.factory("utils", S.Utilities);
    simpleModule.factory("fileUtils", S.FileUtils);

    simpleModule.factory("safeApply", [ S.SafeApply ]);

    simpleModule.service("network", S.NetworkService);
    simpleModule.service("networkManager", S.NetworkManager);

   
    simpleModule.factory("phoneGap", S.PhoneGap);
    simpleModule.service("camera", S.PhoneGapCameraService);
    simpleModule.service("remoteStorage", S.PhoneGapRemoteStorage);
    simpleModule.service("fileManager", S.PhoneGapFileManager);
    simpleModule.service("queueManager", S.QueueManager);
    simpleModule.service("stateManager", S.StateManager);
    
    simpleModule.service("attachmentsManager", S.AttachmentsManager);
    simpleModule.provider("configurationManager", S.ConfigurationManagerProvider);
    simpleModule.provider("azureActiveDirectory", S.AzureActiveDirectoryProvider);
    simpleModule.service("storageService", S.StorageService);
    simpleModule.service("scanner", S.Scanner);
    simpleModule.service("geoLocation", S.GeoLocationService);
    simpleModule.service("languageService", S.LanguageService);
    simpleModule.service("textResource", S.TextResourceService);
    simpleModule.service("loginManager", S.LoginManager);
    simpleModule.factory("entityManager", S.EntityManager);


    simpleModule.filter("l10n", S.LocalizeFilter);
    simpleModule.filter("entityDescription", S.EntityDescriptionFilter);
    simpleModule.filter("gpsLocation", S.GpsLocationFilter);

    simpleModule.directive("simpleBack", S.BackDirective);
    simpleModule.directive("simpleHome", S.HomeDirective);
    simpleModule.directive("sAttachments", S.AttachmentsDirective);
    simpleModule.directive("sScanBarcode", S.ScanBarcodeDirective);
    simpleModule.directive("sHierarchicalSelect", S.HierarchicalSelect);
    simpleModule.directive("sSelect", S.SelectDirective);
    simpleModule.directive("sList", S.ListDirective);
    simpleModule.directive("sAppVersion", [function() {
        return {
            restrict: "E",
            replace:true,
            template: "<span>{{version}}</span>",
            link: function (scope) {
                scope.version = $("meta[name=version]").attr("content");
            }
        };
    }]);
    simpleModule.directive("sCredit", [function() {
        return {
            restrict: "E",
            replace:true,
            template: "<span>{{credit}}</span>",
            link: function (scope) {
                scope.credit = $("meta[name=credit]").attr("content");
            }
        };
    }]);

    simpleModule.directive("sOnline", function() {
        return {
            restrict: "A",
            link: function(scope) {
                scope.$on("Simple.NetworkStatusChanged", function onNetworkStateChanged(args) {
                    scope.isOnline = args.online;
                });
            }
        };
    });
    
    //if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
    //    document.addEventListener("deviceready", onDeviceReady, false);
    //} else {
    //    onDeviceReady(); //this is the browser
    //}

})(Simple);
