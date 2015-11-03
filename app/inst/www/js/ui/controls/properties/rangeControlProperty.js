define(['rcap/js/ui/controls/properties/baseControlProperty', 'text!templates/rangeControl.tpl',
    'ionrangeslider/js/ion.rangeSlider',
    'css!ionrangeslider/css/ion.rangeSlider.css',
    'css!ionrangeslider/css/ion.rangeSlider.skinFlat.css'
    ], function(BaseControlProperty, tpl) {

    'use strict';

    var RangeControlProperty = BaseControlProperty.extend({
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

            this.isHorizontal = options.isHorizontal || true;
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

    return RangeControlProperty;

});