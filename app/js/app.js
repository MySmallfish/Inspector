(function(S){
	var app = angular.module("InspectorApp", ["ngRoute","$strap"]);

    app.service("utils", S.Utilities);
    app.service("scanner", S.Scanner);
    app.service("geoLocation", S.GeoLocationService);
	app.service("storageService", S.StorageService);
	app.service("loginManager", S.LoginManager);
	app.service("remoteDataService", S.RemoteDataService);
	app.service("timeReportManager", S.TimeReportManager);
	
	app.filter("siteDescription", S.SiteDescriptionFilter);
	app.filter("gpsLocation", S.GpsLocationFilter);
	
	app.controller("AppCtrl", S.AppController);
	app.controller("LoginCtrl", S.LoginController);
	app.controller("HomeCtrl", S.HomeController);
	app.controller("ReportCtrl", S.ReportController);
	app.controller("TimeReportsCtrl", S.TimeReportsController);
	app.controller("ScanReportCtrl", S.ScanReportController);
	app.controller("ManualReportCtrl", S.ManualReportController);
	
	
	app.config(function($routeProvider){
		$routeProvider
			.when("/", { templateUrl: "views/home.html", controller: "HomeCtrl" })
			.when("/Login", { templateUrl: "views/login.html", controller: "LoginCtrl" })
			.when("/Setup", { templateUrl: "views/setup.html", controller: "SetupCtrl" })
			.when("/ScanReport", { templateUrl: "views/scanreport.html", controller: "ScanReportCtrl" })
			.when("/ManagerScanReport", { templateUrl: "views/managerreport.html", controller: "ManagerReportCtrl" })
			.when("/ManualReport", { templateUrl: "views/manualreport.html", controller: "ManualReportCtrl" })
			.when("/TimeReports", { templateUrl: "views/reports.html", controller: "TimeReportsCtrl" })
			.when("/ApproveReport", { templateUrl: "views/approve.html", controller: "ReportCtrl" })
			.when("/Settings", { templateUrl: "views/settings.html", controller: "SettingsCtrl" })
			.otherwise({ redirectTo: "/" });
	});
})(Simple);