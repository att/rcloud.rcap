define(['rcap/js/Class'], function() {

    'use strict';

    var generateId = function() {
        return 'rcap' + Math.random().toString(16).slice(2);
    };

    var BaseControl = Class.extend({
        init: function(options) {
            options = options || {};
            this.type = options.type;
            this.label = options.label;
            this.icon = options.icon;

            this.controlProperties = options.controlProperties;
            // generate a random ID:
            this.id = generateId();
        },
        regenerateId: function() {
            this.id = generateId();
            return this;
        },
        deserialize: function() {

        },
        serialize: function() {

        },
        render: function( /*options*/ ) {
            return '<p><i class="icon-' + this.icon + '"></i></p>';
        },
        getDialogMarkup: function() {
            var html = '';

            if (this.controlProperties.length === 0) {
                html = 'There are no configurable properties for this control';
            } else {
                $.each(this.controlProperties, function(key, prop) {
                    html += prop.render(key);
                });
            }

            return html;
        },
        getDialogValue: function() {
            return '';
        },
        toJSON: function() {
            return {
                'type': this.type,
                'id': this.id,
                'controlProperties': this.controlProperties
            };
        },
        getControlPropertyValue: function(uid) {

            var prop = _.findWhere(this.controlProperties, {
                'uid': uid
            });

            if (prop === undefined) {
                throw new Error('control property ' + uid + ' not found.');
            } else {
                return prop.value;
            }

        },
        getControlPropertyValueOrDefault: function(uid) {

            var propValue = this.getControlPropertyValue(uid);

            if (propValue !== undefined && propValue.length > 0) {
                return propValue;
            } else {
                return _.findWhere(this.controlProperties, {
                    'uid': uid
                }).defaultValue;
            }
        }
    });

    return BaseControl;

});
