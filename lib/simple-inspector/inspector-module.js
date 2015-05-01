(function(S, I) {

    var inspector = angular.module("Simple.Inspector", []);

    inspector.service("siteService", I.SiteService);
    inspector.service("employeeService", I.EmployeeService);
    inspector.service("timeReportManager", I.TimeReportManager);
    inspector.service("eventReportManager", I.EventReportManager);

    inspector.config(["simplylogClientProvider", function (simplyLogClientProvider) {
        simplyLogClientProvider.configure({ userName: "inspector@simplylog.co.il", password: "8Wk6W4tm2U" });
    }]);

})(Simple, Simple.Inspector);
