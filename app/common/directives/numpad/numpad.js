(function (S) {
    S.Numpad = function () {
        return {
            restrict: "E",
            templateUrl: "app/common/directives/numpad/numpad.html",
            scope: {
                number: "=",
                command: "=",
                digit: "=",
                maxLength:"@"
            },
            link: function (scope, elm, attrs) {
                //scope.digit = 0;
                scope.number = null;
                scope.command = null;
                var maxLength = parseInt(scope.maxLength || 10, 10);
                scope.$watch("number", function(newValue) {
                    if (newValue) {
                        scope.numpadDisabled = String(newValue).length >= maxLength;
                    } else {
                        scope.numpadDisabled = false;
                    }
                });
                
                elm.find("button").bind("click", function (e) {
                    scope.$apply(function () {
                        var num = scope.number ? String(scope.number) : "";
                        
                        if (e.target.innerHTML == "C") {
                            scope.number = "";
                            scope.command = "clear";
                        } else if (e.target.innerHTML == ".") {
                            scope.command = ".";
                        } else if (e.target.innerHTML == "&lt;") {
                            scope.command = "clearChar";
                            num = num.substr(0, num.length - 1);
                            scope.number = num ? parseInt(num, 10):num;
                        } else {
                            //scope.digit = parseInt(e.target.innerHTML, 10);
                            scope.number = parseInt(num + e.target.innerHTML, 10);
                            scope.command = "digit";
                        }

                    });

                });
            }
        };
    };

})(Simple);