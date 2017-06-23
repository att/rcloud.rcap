define(['rcap/js/ui/properties/textProperty', 'rcap/js/Class'], function(TextProperty) {

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

            this.styleProperties = [
                new TextProperty({
                    uid: 'cssclass',
                    label : 'CSS Class',
                    defaultValue : '',
                    helpText : 'Additional CSS class to be applied to this control. Will be prefixed with rcap-custom- to prevent collisions.',
                    isRequired: false
                })
            ];
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
        getStyleDialogMarkup: function() {
            // general style information controls:

            var markup = '<div class="style-details"><h3><i class="icon-adjust"></i>Styling</h3>';

            _.each(this.styleProperties, function(prop, index) {
                markup += prop.render(index);
            });

            markup += '<div style="clear:both" /></div>';

            return markup;
        },
        getDialogValue: function() {
            return '';
        },
        toJSON: function() {
            var res = {
                'type': this.type,
                'id': this.id,
                'controlProperties': this.controlProperties
            };

            if(this.styleProperties && this.styleProperties.length) {
              res.styleProperties = this.styleProperties;
            }

            return res;
        },
        getCssClass: function() {
            var cssClass = this.getStylePropertyValueOrDefault('cssclass');

            return cssClass.length > 0 ? 'rcap-custom-' + cssClass : undefined;
        },
        getPropertyValue: function(uid) {

            var prop = _.findWhere(this.controlProperties, {
                'uid': uid
            });

            if (prop === undefined) {
                throw new Error('control property ' + uid + ' not found.');
            } else {
                return prop.value;
            }

        },
        getPropertyValueOrDefault: function(uid) {

            var propValue = this.getPropertyValue(uid);

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
