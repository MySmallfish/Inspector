(function(S, I){

    var app = angular.module("Simple.Inspector.InspectorApp");
app.config(function ($routeProvider) {
    $routeProvider
        .when("/", { templateUrl: "app/common/views/home.html", controller: "HomeCtrl" })
        .when("/Login", { templateUrl: "app/common/views/login.html", controller: "LoginCtrl" })
        .when("/ManagerScanReport", { templateUrl: "app/manager/views/managerreport.html", controller: "ManagerReportCtrl" })
        .when("/ManualReport", { templateUrl: "app/time-reports/views/manualreport.html", controller: "ManualReportCtrl" })
        .when("/TimeReports", { templateUrl: "app/time-reports/views/reports.html", controller: "TimeReportsCtrl" })
        .when("/ApproveReport", { templateUrl: "app/time-reports/views/approve.html", controller: "ReportCtrl" })
        .otherwise({ redirectTo: "/" });
});

})(Simple, Simple.Inspector);