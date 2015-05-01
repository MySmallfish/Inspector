(function (S) {

    var simpleModule = angular.module("Simple", []);
    simpleModule.provider("logger", S.LoggerProvider);
    simpleModule.config(["$provide", function configureLoggerDecorators($provide) {
        $provide.decorator("$log", S.LoggerDecorator("log"));
        $provide.decorator("$log", S.LoggerDecorator("info"));
        $provide.decorator("$log", S.LoggerDecorator("error"));
        $provide.decorator("$log", S.LoggerDecorator("debug"));
    }]);


    simpleModule.factory("utils", S.Utilities);
    simpleModule.factory("fileUtils", S.FileUtils);

    simpleModule.factory("safeApply", [S.SafeApply]);

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
    simpleModule.service("flashlight", S.FlashLight);
    simpleModule.service("geoLocation", S.GeoLocationService);
    simpleModule.service("languageService", S.LanguageService);
    simpleModule.service("textResource", S.TextResourceService);
    simpleModule.service("loginManager", S.LoginManager);
    simpleModule.factory("entityManager", S.EntityManager);
    simpleModule.service("alertService", S.AlertService);

    simpleModule.provider("simplylogClient", S.SimplyLogClientProvider);

    simpleModule.filter("l10n", S.LocalizeFilter);
    simpleModule.filter("entityDescription", S.EntityDescriptionFilter);

    simpleModule.directive("simpleBack", S.BackDirective);
    simpleModule.directive("simpleHome", S.HomeDirective);
    simpleModule.directive("sAttachments", S.AttachmentsDirective);
    simpleModule.directive("sScanBarcode", S.ScanBarcodeDirective);
    simpleModule.directive("sHierarchicalSelect", S.HierarchicalSelect);
    simpleModule.directive("sSelect", S.SelectDirective);
    simpleModule.directive("sList", S.ListDirective);
    simpleModule.directive("sWizard", S.WizardDirective);

    simpleModule.directive("sOnline", ["network", function (network) {
        return {
            restrict: "A",
            link: function (scope) {
                scope.isOnline = network.isOnline();
                scope.$on("Simple.NetworkStatusChanged", function onNetworkStateChanged(args) {
                    scope.isOnline = args.online;
                });
            }
        };
    }]);

    simpleModule.directive("sRefocus", function () {
        return {
            restrict: "A",
            scope: {
                model: "=ngModel"
            },
            require: "ngModel",
            link: function (scope, element, attrs, ngModelCtrl) {
                scope.$watch("model", function (value) {

                    if (typeof value !== "undefined" && value.length == 0) {
                        element.focus();
                    }
                });
            }
        }
    });
    simpleModule.directive("sAppVersion", [function () {
        return {
            restrict: "E",
            replace: true,
            template: "<span>{{version}}</span>",
            link: function (scope) {
                scope.version = $("meta[name=version]").attr("content");
            }
        };
    }]);
    simpleModule.directive("sCredit", [function () {
        return {
            restrict: "E",
            replace: true,
            template: "<span>{{credit}}</span>",
            link: function (scope) {
                scope.credit = $("meta[name=credit]").attr("content");
            }
        };
    }]);
    //if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
    //    document.addEventListener("deviceready", onDeviceReady, false);
    //} else {
    //    onDeviceReady(); //this is the browser
    //}

})(Simple);
