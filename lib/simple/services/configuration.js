(function (S) {

    S.Configuration = function (parent, defaultValues) {
        var configValues = {};
        defaultValues = defaultValues || {};

        function get(key) {
            return configValues[key] || (parent ? parent.get(key) : defaultValues[key]);
        }

        function update(key, value) {
            configValues[key] = value;

        }

        return {
            get: get,
            update: update,
            all: function () {
                return configValues;
            }
        };
    };

    S.ConfigurationManager = function ($q, storageService, defaultValues) {
        var root = new S.Configuration(null, defaultValues),
            currentUser, currentUserConfiguration;

        function loadUserConfiguration(user, values) {
            currentUser = user;
            currentUserConfiguration = new S.Configuration(root, values);
        }

        function load() {
            return storageService.prefix("Configuration").local("All").then(function (config) {
                if (config) {
                    root = new S.Configuration(null, config);
                }
                //if (currentUser) {
                //    currentUserConfiguration = new S.Configuration(root, values);
                //}
            });
        }

        function reset() {
            storageService.prefix("Configuration").local("All", null).then(function () {
                root = new S.Configuration(null, defaultValues);
            });
        }

        function save() {
            //function () {
            //    console.log("SAVE CONFIG");
            //    return (currentUser && currentUserConfiguration) ? storageService.prefix("Configuration").local(currentUser, currentUserConfiguration.all()) : $q.when({});
            //}
            return $q.all([
                storageService.prefix("Configuration").local("All", root.all())
            ]);
        }


        return {
            get: function(key) {
                return (currentUserConfiguration ? currentUserConfiguration.get(key) : root.get(key));
            },
            update: function(key, value) {
                (currentUserConfiguration ? currentUserConfiguration.update(key, value) : root.update(key, value));
            },
            loadUserConfiguration: loadUserConfiguration,
            load: load,
            save: save,
            reset: reset
        };
    };

    S.ConfigurationManagerProvider = function () {
        var defaultValues;

        function configure(values) {
            defaultValues = values;
        }

        return {
            configure: configure,
            $get: function ($q, storageService) {
                return new S.ConfigurationManager($q, storageService, defaultValues);
            }
        };
    };

})(Simple);