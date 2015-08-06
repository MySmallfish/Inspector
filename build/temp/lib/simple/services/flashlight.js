(function (S) {
    S.FlashLight = ["$q", function ($q) {

        var flashlight, _isSwitchedOn;
        if (typeof cordova !== "undefined") {
            flashlight = window.plugins.flashlight;
        }

        function isFlashlightAvailable() {
            var result = $q.defer();

            if (flashlight) {
                flashlight.available(function(isAvailable) {
                    if (isAvailable) {
                        result.resolve();
                    } else {
                        result.reject();
                    }
                }, result.reject);
            } else {
                result.reject();
            }

            return result.promise;
        }

        function execute(command) {
            var result = $q.defer();
            isFlashlightAvailable().then(function () {
                flashlight[command](result.resolve, result.reject);
                result.resolve();
            }, result.reject);
            return result.promise;
        }

        function switchOn() {
            return execute("switchOn").then(function() {
                _isSwitchedOn = true;
                return _isSwitchedOn;
            });
        }

        function switchOff() {
            return execute("switchOff").then(function () {
                _isSwitchedOn = false;
                return _isSwitchedOn;
            });
        }

        function toggle() {
            if (isSwitchedOn()) {
                return switchOff();
            } else {
                return switchOn();
            }
        }

        function isSwitchedOn() {
            return _isSwitchedOn;
        }

        return {
            isAvailable: isFlashlightAvailable,
            switchOn: switchOn,
            switchOff: switchOff,
            toggle: toggle,
            isSwitchedOn: isSwitchedOn
        };
    }];
})(Simple);