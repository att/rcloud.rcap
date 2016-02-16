define(['pubsub',
    'site/pubSubTable'], function(PubSub, pubSubTable) {

    'use strict';

    var ThemeManager = function() {

        var themes = [
            { key: 'default', description: 'Default' },
            { key: 'bragi', description: 'Bragi' },
            { key: 'att', description: 'AT&T' }
        ];

        this.getThemes = function() {
            return themes;
        };

        this.getDefaultThemeKey = function() {
            return 'default';
        };

        this.initialise = function() {

            var me = this;
            
            // subscribe to theme change:
            PubSub.subscribe(pubSubTable.setCurrentTheme, function(msg, themeKey) {
                me.applyTheme(themeKey);
            });
        };

        this.cleanUp = function() {
            $('head > link.rcap').remove(); 
        };

        this.applyTheme = function(themeKey) {

            // only one at any time:
            this.cleanUp();
           
            $('head')
                .append($('<link />')
                .attr({ 
                    'class': 'rcap',
                    'type': 'text/css', 
                    'rel': 'stylesheet', 
                    'href': '/shared.R/rcloud.rcap/themes/' + themeKey + '/' + themeKey + '.css'
                }));
        };

    };

    return ThemeManager;
});