(function(S, I){
    var app = angular.module("Simple.Inspector.InspectorApp", ["ngRoute", "ngTouch", "Simple", "Simple.Inspector"]);

	app.service("loginManager", S.LoginManager);
	app.service("configuration", S.Configuration);
	app.service("inspectorApi", S.InspectorApi);


	app.controller("AppCtrl", I.AppController);
	app.controller("LoginCtrl", I.LoginController);
	app.controller("HomeCtrl", I.HomeController);
    app.controller("RegisterPhoneNumberCtrl", I.RegisterPhoneNumberController);
	
	app.controller("ReportCtrl", I.ReportController);
	app.controller("TimeReportsCtrl", I.TimeReportsController);
	app.controller("ManualReportCtrl", I.ManualReportController);
	app.controller("ManagerReportCtrl", I.ManagerReportController);
	app.controller("EventTimeReportsCtrl", I.EventTimeReportsController);
	
    
	app.directive("appHeader", I.AppHeaderDirective);
	app.directive("numpad", S.Numpad);

	app.config(["loggerProvider", function configureInspectorLogger(loggerProvider) {
	    loggerProvider.configure({
	        token: "42e383d3-09c7-446a-bab6-cb1101d5a5fa"
	    });
	}]);


})(Simple, Simple.Inspector);