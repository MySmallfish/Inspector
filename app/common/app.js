(function(S, I){
    var app = angular.module("Simple.Inspector.InspectorApp", ["ngRoute", "ngTouch", "Simple", "Simple.Inspector"]);

	app.service("loginManager", S.LoginManager);
	
	
	app.controller("AppCtrl", I.AppController);
	app.controller("LoginCtrl", I.LoginController);
	app.controller("HomeCtrl", I.HomeController);
	app.controller("ReportCtrl", I.ReportController);
	app.controller("TimeReportsCtrl", I.TimeReportsController);
	app.controller("ManualReportCtrl", I.ManualReportController);
	app.controller("ManagerReportCtrl", I.ManagerReportController);
    
	app.directive("appHeader", I.AppHeaderDirective);
	app.directive("numpad", S.Numpad);

})(Simple, Simple.Inspector);