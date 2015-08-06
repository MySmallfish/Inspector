(function (S) {
    S.WizardDirective = ["$animate", function($animate) {
        return {
            restrict: "E",
            replace: true,
            transclude: true,
            templateUrl: "lib/simple/directives/wizard/wizard.html",
            scope: {
                steps: "=",
                currentStep: "=",
                canMoveNext:"=",
                canMoveBack: "=",
                displayHints: "@"
            },
            //link: function(scope, element) {
            //    scope.$watch("currentStep", function(newValue, oldValue) {
                    
            //    });
            //},
            controller: ["$scope", function ($scope) {
                
                var stepIndex = 0;
                function chooseStep(index) {
                    stepIndex = index;
                    $scope.currentStep = index;
        
                    $scope.canMoveNext = canMoveNext();
                    $scope.canMoveBack = canMoveBack();
                }
                function next() {
                    chooseStep(stepIndex + 1);
                }

                function back() {
                    chooseStep(stepIndex - 1);
                }

                function canMoveNext() {
                    return stepIndex < $scope.steps.length-1;
                }
                function canMoveBack() {
                    return stepIndex > 0;
                }
                function tryMoveNext() {
                    if (canMoveNext()) {
                        next();
                    }
                }
                function tryMoveBack() {
                    if (canMoveBack()) {
                        back();
                    }
                }
                $scope.$on("Simple.Wizard.Next", next);
                $scope.$on("Simple.Wizard.Back", back);

                _.extend($scope, {
                    next: next,
                    back: back,
                    canMoveNext: canMoveNext,
                    canMoveBack: canMoveBack,
                    tryMoveNext: tryMoveNext,
                    tryMoveBack: tryMoveBack,
                    chooseStep: chooseStep
                });

                chooseStep(0);
            }]
        };
    }];
})(Simple);