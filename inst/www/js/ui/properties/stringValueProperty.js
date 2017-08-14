define(['rcap/js/ui/properties/baseProperty', 'text!templates/stringValueControl.tpl'], function(BaseProperty, tpl) {

    'use strict';

    // var getValueType = function(value) {
    //     if( typeof(value) === 'string') {
    //         return 'code';
    //     } else if (Object.prototype.toString.call(value) === '[object String]') {
    //         return 'manual';
    //     } else {
    //        // throw new TypeError('was expecting a string or an array');
    //         return 'shane';
    //     }
    // };

    var StringValueProperty = BaseProperty.extend({
        init: function(options) {
            options = options || {};
            this._super({
                type: 'stringvalue',
                label: options.label || '',
                helpText: options.helpText || '',
                defaultValue: options.defaultValue || '',
                isRequired: options.isRequired || false,
                uid: options.uid,
                value: options.value
            });

            this.valueType = options.valueType || 'manual';
            this.codeHelpText = options.codeHelpText || 'Enter a function that retrieves the value at runtime';
            this.serviceName = options.serviceName || 'getRFunctions';

        },
        render: function(childIndex) {

            var template = _.template(tpl);

            return template({
                property: this,
                childIndex: childIndex
            });

        },
        toJSON: function() {
            var json = this._super();
            json.valueType = this.valueType; // getValueType(this.value);
            return json;
        },
        getDialogValue: function() {
            if ($('#valueType-manual-' + this.id).is(':checked')) {

                this.valueType = 'manual';

                // return an array:
                return $('#input-valueType-manual-' + this.id).val();
            } else {

                this.valueType = 'code';

                // return a string:
                return $('#input-valueType-code-' + this.id).val();
            }
        },
        translateValueToText: function() {
            return _.pluck(this.value, 'label').join('\n');
        },
        finalise : function() {
            this.optionType = this.valueType; // getValueType(this.value);
        }
    });

    return StringValueProperty;

});
