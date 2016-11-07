define(['rcap/js/ui/controls/baseControl',
    'rcap/js/ui/properties/colorProperty',
    'rcap/js/ui/properties/rangeProperty',
    'rcap/js/ui/properties/textProperty'
], function(BaseControl, ColorProperty, RangeProperty, TextProperty) {

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
                new RangeProperty({
                    uid: 'padding',
                    label: 'Padding',
                    helpText: '',
                    defaultValue: 0,
                }),
                new ColorProperty({
                    uid: 'backgroundColor',
                    label: 'Background Color',
                    helpText: '',
                    defaultValue: 'rgba(0,0,0,0)',
                    showAlpha: true
                }),
                new ColorProperty({
                    uid: 'borderColor',
                    label: 'Border Color',
                    helpText: '',
                    defaultValue: 'rgb(255, 255, 255)',
                    showAlpha: false
                }),
                new RangeProperty({
                    uid: 'borderWidth',
                    label: 'Border Width',
                    helpText: 'Border will only be shown if it has a width',
                    defaultValue: '0'
                }),
                new TextProperty({
                    uid: 'cssclass',
                    label : 'CSS Class',
                    defaultValue : '',
                    helpText : 'Additional CSS class to be applied to this control. Will be prefixed with rcap-custom- to prevent collisions.',
                    isRequired: false
                })
            ];

            this.initialSize = options.initialSize || [2, 2];
            this.width = +this.initialSize[0];
            this.height = +this.initialSize[1];
            this.controlProperties = options.controlProperties;

            this.isOnGrid = options.isOnGrid || false;
            this.controlCategory = options.controlCategory;
        },
        getStylePropertyByName: function(identifier) {
            return _.findWhere(this.styleProperties, { uid : identifier });
        },
        getStylePropertyValueOrDefault: function(identifier) {

            var styleProperty = this.getStylePropertyByName(identifier);

            if (styleProperty) {
                return styleProperty.value || styleProperty.defaultValue;
            } else {
                throw new Error('style property ' + identifier + ' not found.');
            }
        },
        getCssClass: function() {
            var cssClass = this.getStylePropertyValueOrDefault('cssclass');

            return cssClass.length > 0 ? 'rcap-custom-' + cssClass : undefined;
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
