(function (S) {
    S.StorageService = function ($q) {
        var prefix = "";
        function deserialize(value) {
            var result = $q.defer();
            result.resolve(value ? JSON.parse(value) : null);
            return result.promise;
        }
        function serialize(value) {
            var result = $q.defer();
            result.resolve(value ? JSON.stringify(value) : "");
            return result.promise;
        }
        var wrappers = {
            session: {
                get: function (key) {
                    return deserialize(sessionStorage.getItem(key));
                },
                set: function (key, value) {
                    if (value === null) {
                        var result = $q.defer();
                        sessionStorage.removeItem(key);
                        result.resolve(key);
                        return result.promise;
                    } else {
                        return serialize(value).then(function (serializedValue) {
                            sessionStorage.setItem(key, serializedValue);
                            return serializedValue;
                        });
                    }
                }
            },
            local: {
                get: function (key) {
                    return deserialize(localStorage.getItem(key));
                },
                set: function (key, value) {
                    if (value === null) {
                        var result = $q.defer();
                        localStorage.removeItem(key);
                        result.resolve(key);
                        return result.promise;
                    } else {
                        return serialize(value).then(function (serializedValue) {
                            localStorage.setItem(key, serializedValue);
                            return serializedValue;
                        });
                    }
                }
            }
        };

        function item(type, key, value) {

            var wrapper = wrappers[type];
            if (wrapper) {
                key = (prefix || "") + ":" + key;
                if (typeof value !== "undefined") {
                    return wrapper.set(key, value);
                } else {
                    return wrapper.get(key);
                }
            } else {
                throw new Error("Storage Type '" + type + "' is not configured.");
            }
        }

        return {
            session: function(key, value) {
                return item("session", key, value);
            },
            local: function(key, value) {
                return item("local", key, value);
            },
            prefix: function(newPrefix) {
                if (typeof newPrefix !== "undefined") {
                    prefix = newPrefix;
                    return this;
                } else {
                    return prefix;
                }
            }
        };
    };
})(Simple);