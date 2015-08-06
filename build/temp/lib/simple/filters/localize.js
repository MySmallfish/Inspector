(function (S) {
    S.LocalizeFilter = ["textResource",function (textResource) {
        return function (key) {
            var value = textResource.get(key);
            if (typeof value === "undefined") {
                value = key;
            }
            return value;
        };
    }];
})(Simple);