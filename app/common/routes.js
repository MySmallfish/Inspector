(function(S, I){

    var app = angular.module("Simple.Inspector.InspectorApp");
app.config(function ($routeProvider) {
    $routeProvider
        .when("/", { templateUrl: "app/common/views/home.html", controller: "HomeCtrl" })
        .when("/Login", { templateUrl: "app/common/views/login.html", controller: "LoginCtrl" })
        .when("/ManagerReport", { templateUrl: "app/manager/views/manager-report.html", controller: "ManagerReportCtrl" })
        .when("/ManualReport", { templateUrl: "app/time-reports/views/manualreport.html", controller: "ManualReportCtrl" })
        .when("/TimeReports", { templateUrl: "app/time-reports/views/reports.html", controller: "TimeReportsCtrl" })
        .when("/ApproveReport", { templateUrl: "app/time-reports/views/approve.html", controller: "ReportCtrl" })
        .when("/EventTimeReports/:eventId", { templateUrl: "app/manager/views/event-time-reports.html", controller: "EventTimeReportsCtrl" })
        .otherwise({ redirectTo: "/" });
});

})(Simple, Simple.Inspector);