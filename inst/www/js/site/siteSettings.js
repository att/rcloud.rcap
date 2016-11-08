define(['rcap/js/ui/properties/textProperty'], function(TextProperty) {

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