define(['rcap/js/ui/properties/baseProperty', 'text!templates/rangeControl.tpl',
    'ionrangeslider/js/ion.rangeSlider',
    'css!ionrangeslider/css/ion.rangeSlider.css',
    'css!ionrangeslider/css/ion.rangeSlider.skinFlat.css'
    ], function(BaseProperty, tpl) {

    'use strict';

    var RangeProperty = BaseProperty.extend({
        init: function(options) {
            options = options || {};
            this._super({
                type: 'range',
                label: options.label || '',
                helpText: options.helpText || '',
                defaultValue: options.defaultValue || '',
                isRequired: options.isRequired || false,
                uid: options.uid,
                className: options.className,
                value: options.value || '0'
            });

            // additional assignments go here:
            this.minValue = options.minValue || 0;
            this.maxValue = options.maxValue || 20;

            this.isHorizontal = _.isUndefined(options.isHorizontal) ? true : options.isHorizontal;
        },
        render: function(childIndex) {

            var template = _.template(tpl);

            return template({
                property: this,
                childIndex: childIndex
            });

        },
        getDialogValue: function() {
            return $('#' + this.id).val();
        }
    });

    return RangeProperty;

});