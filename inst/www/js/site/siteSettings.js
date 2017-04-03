define(['rcap/js/ui/properties/textProperty', 'rcap/js/ui/properties/dropdownProperty'], function(TextProperty, DropdownProperty) {

    'use strict';

    var SiteSettings = Class.extend({
        init: function() {
            this.properties = [
                new TextProperty({
                    uid: 'pageClass',
                    label : 'Page class',
                    defaultValue : '',
                    helpText : 'Apply a CSS class to each page',
                    isRequired: false,
                }),
                new DropdownProperty({
                    uid: 'siteThemePackage',
                    label: 'Site Theme Package',
                    isRequired: false,
                    availableOptions: window.RCAP.getRCAPStyles ? window.RCAP.getRCAPStyles().map(function(style) { 
                        return {
                            text: style.package,
                            value: style.package
                        };
                    }) : [],
                    helpText: 'Custom theme'
                })
            ];
        },
        // getAvailableThemes: function() {
        //     // ascertain the theme options, based on set theme (if any) unioned with available themes:
        //     var selectedTheme = this.getSettingValue('siteThemePackage');

        //     var availableThemes = window.RCAP.getRCAPStyles ? window.RCAP.getRCAPStyles().map(function(style) { 
        //                 return {
        //                     text: style.package,
        //                     value: style.package
        //                 };
        //             }) : [];

        //     if(selectedTheme && !_.findWhere(availableThemes, { value : selectedTheme })) {
        //         availableThemes.push({
        //             text: selectedTheme,
        //             value: selectedTheme
        //         });
        //     }

        //     return availableThemes;
        // },
        getSettingValue: function(uid) {
            return _.findWhere(this.properties, {
                uid: uid
            }).value;
        },
        extract: function() {
            var obj = {};

            this.properties.forEach(function(prop) {
                obj[prop.uid] = prop.value;
            });

            return obj;
        }
    });

    return SiteSettings;

});
