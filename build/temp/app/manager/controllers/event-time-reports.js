(function (S, I) {
    I.EventTimeReportsController = ["$q", "$scope", "$routeParams", "eventReportManager", "employeeService", function ($q, $scope, $routeParams, eventReportManager, employeeService) {
        $scope.timeReports = [];

        $scope.changeHeader({
            header: "EventTimeReports",
            back: true
        });

        function createTimeReports(reports) {

            var timeReports = {};
            _.each(reports, function (report) {
                var timeReport = timeReports[report.Employee.Id] || {
                    EmployeeId: report.Employee.Id,
                    EmployeeName: report.Employee.Name
                };

                timeReports[report.Employee.Id] = timeReport;

                if (report.IsEnter) {
                    timeReport.EnterTime = moment(report.Date).format("HH:mm");
                } else {
                    timeReport.ExitTime = moment(report.Date).format("HH:mm");
                }

            });

            $scope.timeReports = _.map(timeReports, function (report, key) {
                return report;
            });
        }

        eventReportManager.getEventById($routeParams.eventId).then(function (item) {
            $scope.event = item;

            eventReportManager.getReportsByEventId($routeParams.eventId).then(function (items) {
                if (items) {
                    createTimeReports(items);
                }
            });
        });

    }];

})(Simple, Simple.Inspector);