(function (S, SL) {

    SL.SplitContentDirective = [
        function () {
            return {
                restrict: 'E',
                scope: {
                    content: "=",
                    itemClick: "&"
                },
                link: function (scope, element) {
                    scope.$watchCollection("content", function (content) {
                        element.empty();

                        function onItemClick(index, text) {
                            return function () {
                                
                                if (scope.itemClick) {
                                    scope.itemClick({ index: index, text: text });
                                }
                            };
                        }

                        if (content) {
                            var part = $("<span/>").addClass("part"),
                                partClass = content.length > 1 ? "part-" + content.length : "";

                            for (var i = 0; i < content.length; i++) {
                                var newPart = part.clone().text(content[i] || "");
                                if (partClass) {
                                    newPart.addClass(partClass);
                                }
                                newPart.click(onItemClick(i, newPart.text()));
                                element.append(newPart);
                            }
                        }
                    });
                }
            };
        }
    ];

})(Simple, SimplyLog);