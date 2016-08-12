define(['rcap/js/ui/controls/properties/baseControlProperty', 'text!templates/textControl.tpl'], function(BaseControlProperty, tpl) {

    'use strict';

    var TextControlProperty = BaseControlProperty.extend({
        init: function(options) {
            options = options || {};
            this._super({
                type: 'text',
                label: options.label || '',
                helpText: options.helpText || '',
                defaultValue: options.defaultValue || '',
                isRequired: options.isRequired || false,
                uid: options.uid,
                className: options.className,
                value: options.value || options.defaultValue
            });

            // additional assignments go here:
            this.validationDataType = options.validationDataType;

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

    return TextControlProperty;

});