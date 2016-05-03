define([
    'pubsub', 'site/pubSubTable',  
    'text!rcap/js/versionConverters/legacyThemes/att.css',
    'text!rcap/js/versionConverters/legacyThemes/bragi.css'
], function(PubSub, pubSubTable, themeAtt, themeBragi) {

    'use strict';

    var VersionConverter = function() {

        var converters = [{
            from: undefined,
            to: 1.0,
            convert: function(json) {
                if(['bragi', 'att'].indexOf(json.theme) !== -1) {
                    PubSub.publish(pubSubTable.updateTheme, json.theme === 'bragi' ? themeBragi : themeAtt);
                }
                json.theme = undefined;

                return json;
            }
        },

        // add more converters here:

        ];

        this.processJson = function(json) {

            var convertedJson = json;

            _.each(converters, function(converter) {

                if(_.isUndefined(convertedJson.version) && _.isUndefined(converter.from) || 
                    convertedJson.version && converter.from && convertedJson.version === converter.from) {
                    convertedJson = converter.convert(convertedJson);
                    convertedJson.vesion = converter.to;
                }
            });

            return convertedJson;
        };

    };

    return VersionConverter;

});