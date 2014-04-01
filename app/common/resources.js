(function (S, I) {

    var simplyLogModule = angular.module("Simple.Inspector.InspectorApp");
    simplyLogModule.run(function (textResource) {
        textResource.load("he-IL", {
            "RegisterPhoneNumberHint":"על מנת לדווח מהאפליקציה יש להרשם תחילה עם מספר הטלפון. משיסתיים הרישום תקבל הודעת SMS למכשירך עם קוד ייחודי בן 6 ספרות. יש להזין את הקוד במקום המיועד וללחוץ על 'אישור'.",
            "EnterYourPhoneNumber": "נא הזן את מספר הטלפון ממנו מתבצע הדיווח:",
            "Register": "הרשם",
            "RegisterPhoneTitle":"רישום מכשיר",
            "EnterReceivedCode":"הזן את הקוד שקיבלת בהודעת SMS:",
            "Loading": "בטעינה",
            "ManualReport": "דיווח ידני",
            "Enter": "כניסה",
            "Exit": "יציאה",
            "ManagerReport": "סריקת מנהל",
            "ReportHeader": "דיווח",
            "ActionsHeader": "פעולות נוספות",
            "TimeReports": "דיווחים",
            "Repair": "תיקון",
            "Approve": "אישור",
            "Date": "תאריך",
            "Time": "שעה",
            "Site": "עמדה / אתר",
            "Location": "מיקום (GPS)",
            "Employee": "עובד",
            "BarCode": "קוד אתר",
            "Type": "סוג",
            "Inspector": "Inspector",
            "Login": "כניסה למערכת",
            "ApproveReport": "אישור דיווח",
            "Event": "אירוע",
            "EnterSiteCode": "הזן קוד אתר",
            "SelectEvent": "בחר אירוע",
            "EventTimeReports": "דיווחים לאירוע",
            "WaitingForScan": "ממתין לסריקה",
            "EmployeeMissing": "לא נמצא עובד",
            "SiteMissing": "לא נמצא אתר",
            "LocationNotFound": "לא נמצא מיקום",
            "UnexpectedError": "אירעה שגיאה בלתי צפויה",
            "EnterPassword": "סיסמה",
            "EnterUserName": "שם משתמש",
            "SendReports": "שלח דוחות"
        });
    });

})(Simple, Simple.Inspector);