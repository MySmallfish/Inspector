(function (S, I) {

    S.Configuration = function () {
        function getValue(name) {
            return $("head meta[name='" + name + "']").attr("content");
        }

        var config = {
            baseUrl: getValue("base-url")
        };

        return config;
    };

})(Simple, Simple.Inspector);
