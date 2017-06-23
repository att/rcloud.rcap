define(['rcap/js/ui/properties/textProperty', 'rcap/js/ui/properties/dropdownProperty'], function(TextProperty, DropdownProperty) {

    'use strict';

    var SiteSettings = Class.extend({
        init: function() {
            this.properties = [
                new DropdownProperty({
                    uid: 'gridControlPadding',
                    label: 'Grid Control Padding',
                    isRequired: false,
                    availableOptions: _.map([0, 5, 10, 20], function(val) { return {
                            text: val.toString(),
                            value: val.toString()
                        };
                    }),
                    value: '20',
                    helpText: 'The amount of padding around each control (in pixels)'
                }),
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
