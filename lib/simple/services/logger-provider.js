(function (S) {

    S.LoggerDecorator = function(level) {
        return function($delegate) {
            function prepareLogFn(loggingFunc) {
                return function () {
                    if (S.CurrentLogger) {
                        S.CurrentLogger[level].apply(S.CurrentLogger, arguments);
                    }
                    loggingFunc.apply(null, arguments);
                }
            }

            $delegate[level] = prepareLogFn($delegate[level]);
            return $delegate;
        }
    };

    S.LoggerProvider = function () {

        function configure(config) {
            var logger = Simple[(config.logger || "Loggly") + "Logger"];

            if (logger) {
                S.CurrentLogger = logger(config);
            }
        }

        return {
            configure: configure,
            $get: function () {
                return S.CurrentLogger;
            }
        }

    };
    //'42e383d3-09c7-446a-bab6-cb1101d5a5fa'
    S.LogglyLogger = function (config) {
        window._LTracker = window._LTracker || [];
        window._LTracker.push({ 'logglyKey': config.token });
        return {
            log: function (info) {
                window._LTracker.push(info);
            },
            logWithCategory: function (category, args) {
                this.log({
                    category: category,
                    text: args[0],
                    error: args[1]
                });
            },
            error: function () {
                this.logWithCategory("Error", arguments);
            },
            debug: function () {
                this.logWithCategory("Debug", arguments);
            },
            info: function() {
                this.logWithCategory("Info", arguments);
            }
        }
    }
})(Simple);