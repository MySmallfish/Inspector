(function (S, I) {

    S.Configuration = function () {
        function getValue(name) {
            return $("head meta[name='" + name + "']").attr("content");
        }

        

        var config = {
            baseUrl: getValue("base-url"),
            autoCommitReport: getValue("auto-commit") == "true",
            displaySuccessfulReports: getValue("display-successful") == "true"
        };

        return config;
    };

})(Simple, Simple.Inspector);
