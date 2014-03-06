(function(S, I) {

    var inspector = angular.module("Simple.Inspector", []);

    inspector.service("siteService", I.SiteService);
    inspector.service("employeeService", I.EmployeeService);
    inspector.service("timeReportManager", I.TimeReportManager);
    inspector.service("eventReportManager", I.EventReportManager);

})(Simple, Simple.Inspector);
