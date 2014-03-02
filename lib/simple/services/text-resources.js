(function (S) {

    S.TextResourceService = function (languageService) {
        var resources = {}, language = languageService.get() || "en-US";
        
        function getLanguageResources(lang) {
            return resources[lang] || {};
        }

        function load(lang, texts) {
            resources[lang] = getLanguageResources(lang);
            resources[lang] = _.extend(resources[lang], texts);
        }

        function setLanguage(lang) {
            language = lang;
        }

        function get(key) {
            var langResources = getLanguageResources(language);
            return langResources[key];
        }

        return {
            get: get,
            setLanguage: setLanguage,
            load: load
        };
    };
    
})(Simple);