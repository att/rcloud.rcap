define(['rcap/js/ui/controls/baseControl',
    'rcap/js/ui/controls/properties/colorControlProperty',
    'rcap/js/ui/controls/properties/rangeControlProperty'
], function(BaseControl, ColorControlProperty, RangeControlProperty) {

    'use strict';

    var GridControl = BaseControl.extend({
        init: function(options) {
            options = options || {};

            this._super({
                type: options.type,
                label: options.label,
                icon: options.icon
            });

            this.x = +options.x;
            this.y = +options.y;

            this.styleProperties = [
                new RangeControlProperty({
                    uid: 'padding',
                    label: 'Padding',
                    helpText: '',
                    defaultValue: 0,
                }),
                new ColorControlProperty({
                    uid: 'backgroundColor',
                    label: 'Background Color',
                    helpText: '',
                    defaultValue: ''
                }),
                new ColorControlProperty({
                    uid: 'borderColor',
                    label: 'Border Color',
                    helpText: '',
                    defaultValue: ''
                }),
                new RangeControlProperty({
                    uid: 'borderWidth',
                    label: 'Border Width',
                    helpText: '',
                    defaultValue: '0'
                })
            ];

            this.initialSize = options.initialSize || [2, 1];
            this.width = +this.initialSize[0];
            this.height = +this.initialSize[1];
            this.controlProperties = options.controlProperties;

            this.isOnGrid = options.isOnGrid || false;
        },
        getStylePropertyByName: function(identifier) {
            return _.findWhere(this.styleProperties, { uid : identifier });
        },
        getStyleProperties: function() {
            var styleInfo = {
                'background-color': this.getStylePropertyByName('backgroundColor').value,
                'padding': this.getStylePropertyByName('padding').value,
            };

            // if a border has been specified, use that, otherwise use the default:
            if (+this.getStylePropertyByName('borderWidth').value > 0 && this.getStylePropertyByName('borderColor').value) {
                styleInfo['border-color'] = this.getStylePropertyByName('borderColor').value;
                styleInfo['border-width'] = this.getStylePropertyByName('borderWidth').value;
                styleInfo['border-style'] = 'solid';
            }

            return styleInfo;
        },
        initialWidth: function() {
            return this.initialSize[0];
        },
        initialHeight: function() {
            return this.initialSize[1];
        },
        deserialize: function() {

        },
        serialize: function() {

        },
        render: function( /*options*/ ) {
            return '<p><i class="icon-' + this.icon + '"></i>' + this.label + ': RENDER</p>';
        },
        getDialogMarkup: function() {
            var html = '';

            $.each(this.controlProperties, function(key, prop) {
                html += prop.render(key);
            });

            // general style information controls:
            html += this.getStyleDialogMarkup();

            return html;
        },
        getStyleDialogMarkup: function() {
            // general style information controls:

            var markup = '<div class="style-details">';

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
            return {
                'type': this.type,
                'x': this.x,
                'y': this.y,
                'width': this.width,
                'height': this.height,
                'id': this.id,
                'styleProperties': this.styleProperties,
                'controlProperties': this.controlProperties,
                'isOnGrid': true
            };
        },
        isValid: function() {
            // ensure that the 'invalid' item count is 0:
            return _.filter(this.controlProperties, function(p) {
                return p.isRequired && (typeof p.value === 'undefined' || p.value.length === 0);
            }).length === 0;
        },
        initialiseViewerItems: function() {

        }
    });

    return GridControl;

});
