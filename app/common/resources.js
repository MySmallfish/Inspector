﻿(function (S, I) {

    var simplyLogModule = angular.module("Simple.Inspector.InspectorApp");
    simplyLogModule.run(function (textResource) {
        textResource.load("he-IL", {
            "Loading": "בטעינה",
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
            "BarCode":"קוד אתר",
            "Type": "סוג",
            "Inspector": "Inspector",
            "Login": "כניסה למערכת",
            "ApproveReport": "אישור דיווח",
            "Event":"אירוע",
            "EnterSiteCode": "הזן קוד אתר",
            "SelectEvent":"בחר אירוע",
            "EventTimeReports": "דיווחים לאירוע",
            "WaitingForScan":"ממתין לסריקה"
        });
    });

})(Simple, Simple.Inspector);