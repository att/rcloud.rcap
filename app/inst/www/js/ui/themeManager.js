define(['rcap/js/assetManager'],
    function(AssetManager) {

    'use strict';

    var ThemeManager = function() {

        this.initialise = function() {

            var assetManager = new AssetManager();
            
            var themeUrl = assetManager.getThemeUrl();

            if(themeUrl) {
                $('head')
                    .append($('<link />')
                    .attr({ 
                        'class': 'rcap',
                        'type': 'text/css', 
                        'rel': 'stylesheet', 
                        'href': themeUrl 
                    }));
            }

        };

        this.cleanUp = function() {
            $('head > link.rcap').remove();
        };

    };

    return ThemeManager;
});
