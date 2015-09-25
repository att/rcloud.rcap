define(['rcap/js/ui/controls/baseControl'], function(BaseControl) {

    'use strict';

    var GridControl = BaseControl.extend({
        init: function(options) {
            options = options || {};

            this._super({
                type: options.type,
                label: options.label,
                icon: options.icon,
                inlineIcon: options.inlineIcon
            });

            this.x = +options.x;
            this.y = +options.y;

            this.initialSize = options.initialSize || [2, 1];
            this.width = +this.initialSize[0];
            this.height = +this.initialSize[1];
            this.controlProperties = options.controlProperties;

            this.isOnGrid = options.isOnGrid || false;
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
        render: function(/*options*/) {
            return '<p><i class="icon-' + this.inlineIcon + '"></i>' + this.label + ': RENDER</p>';
        },
        getDialogMarkup: function() {
            var html = '';

            $.each(this.controlProperties, function(key, prop) {
                html += prop.render(key);
            });

            return html;
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
                'controlProperties': this.controlProperties,
                'isOnGrid': true
            };
        },
        isValid: function() {
        	// ensure that the 'invalid' item count is 0:
            return _.filter(this.controlProperties, function(p) {
                return p.isRequired && (typeof p.value === 'undefined' || p.value.length === 0);
            }).length === 0;
        }
    });

    return GridControl;

});
