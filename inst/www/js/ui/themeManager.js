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

            PubSub.subscribe(pubSubTable.updateSiteThemePackage, function(msg, siteThemePackage) {
                me.applyPackageTheme(siteThemePackage);
            });

            PubSub.subscribe(pubSubTable.initSite, function(msg, site) {
                // extract settings:
                var settings = site.settings.extract();

                me.applyPackageTheme(settings.siteThemePackage);
            });

        };

        this.cleanUp = function() {
            $('head > link.rcap').remove(); 
        };

        this.addLink = function(themeUri, stylesheetClass) {

            $('head > link.' + stylesheetClass).remove(); 

            if(themeUri) {
                $('head')
                    .append($('<link />')
                    .attr({ 
                        'class': 'rcap ' + stylesheetClass,
                        'type': 'text/css', 
                        'rel': 'stylesheet', 
                        'href': themeUri
                    }));
            }
        };

        this.applyTheme = function(themeUri) {
            this.addLink(themeUri, 'rcap');
        };

        this.applyPackageTheme = function(siteThemePackage) {
            this.addLink('/shared.R/' + siteThemePackage + '/rcap-style.css', 'rcappackage');
        };

    };

    return ThemeManager;
});