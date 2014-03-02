(function (S, I) {

    var simplyLogModule = angular.module("Simple.Inspector.InspectorApp");
    simplyLogModule.run(function (textResource) {
        textResource.load("he-IL", {
            "ManualReport": "דיווח ידני",
            "Enter": "כניסה",
            "Exit": "יציאה",
            "ManagerReport": "סריקת מנהל",
            "ReportHeader": "דיווח",
            "ActionsHeader":"פעולות נוספות",
            "TimeReports": "דיווחים",
            "Repair": "תיקון",
            "Approve":"אישור",
            "Date":"תאריך",
            "Time":"שעה",
            "Site":"עמדה / אתר",
            "Location":"מיקום (GPS)",
            "Employee":"עובד",
            "BarCode":"בר קוד",
            "Type":"סוג"
        });
    });

})(Simple, Simple.Inspector);