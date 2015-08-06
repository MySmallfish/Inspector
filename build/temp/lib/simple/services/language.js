(function (S) {
    S.LanguageService = ["$document", function($document) {
        
        function get() {
            return $document[0].documentElement.lang;
        }

        return {
            get: get
        };
    }];
})(Simple);