define(['pubsub',
    'site/pubSubTable'], function(PubSub, pubSubTable) {

    'use strict';

    var ThemeManager = function() {

        this.initialise = function() {

            var me = this;

            // subscribe to theme change:
            PubSub.subscribe(pubSubTable.updateDomTheme, function(msg, themeUri) {
                me.applyAssetTheme(themeUri);
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

        this.applyLink = function(themeUri, stylesheetClass) {

            // first remove the link, if any:
            $('head > link.' + stylesheetClass).remove();

            // validate stylesheetClass:
            if(['package', 'asset'].indexOf(stylesheetClass) < 0 || !themeUri){
                return;
            }

            var linkToInsert = $('<link />')
                    .attr({
                        'class': stylesheetClass,
                        'type': 'text/css',
                        'rel': 'stylesheet',
                        'href': themeUri
                    });

            // valid order is package, asset:
            var selectorPrefix = 'head > link.';

            if(stylesheetClass === 'asset') {
                var packageLink = $(selectorPrefix + 'package');

                if(packageLink.length) {
                    linkToInsert.insertAfter(packageLink);
                } else {
                    $('head').append(linkToInsert);
                }
            } else if(stylesheetClass === 'package') {
                var assetLink = $(selectorPrefix + 'asset');

                if(assetLink.length) {
                    linkToInsert.insertBefore(assetLink);
                } else {
                    $('head').append(linkToInsert);
                }
            }
        };

        this.applyAssetTheme = function(themeUri) {
            this.applyLink(themeUri, 'asset');
        };

        this.applyPackageTheme = function(siteThemePackage) {
            if(siteThemePackage) {
                this.applyLink('/shared.R/' + siteThemePackage + '/rcap-style.css', 'package');
            } else {
                this.applyLink(undefined, 'package');
            }
        };

    };

    return ThemeManager;
});
