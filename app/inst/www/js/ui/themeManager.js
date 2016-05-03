define(['pubsub',
    'site/pubSubTable'], function(PubSub, pubSubTable) {

    'use strict';

    var ThemeManager = function() {

        this.initialise = function() {

            var me = this;
            
            // subscribe to theme change:
            PubSub.subscribe(pubSubTable.updateDomTheme, function(msg, themeUri) {
                me.applyTheme(themeUri);
            });
        };

        this.cleanUp = function() {
            $('head > link.rcap').remove(); 
        };

        this.applyTheme = function(themeUri) {

            // only one at any time:
            this.cleanUp();
           
            $('head')
                .append($('<link />')
                .attr({ 
                    'class': 'rcap',
                    'type': 'text/css', 
                    'rel': 'stylesheet', 
                    'href': themeUri
                }));
        };

    };

    return ThemeManager;
});