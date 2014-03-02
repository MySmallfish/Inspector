(function (S) {
    S.LocalizeFilter = function (textResource) {
        return function (key) {
            var value = textResource.get(key);
            if (typeof value === "undefined") {
                value = key;
            }
            return value;
        };
    };
})(Simple);