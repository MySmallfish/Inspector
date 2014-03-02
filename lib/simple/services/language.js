(function (S) {
    S.LanguageService = function($document) {
        
        function get() {
            return $document[0].documentElement.lang;
        }

        return {
            get: get
        };
    };
})(Simple);