define(['rcap/js/ui/controls/properties/baseControlProperty', 'text!templates/multiOptionControl.tpl'], function(BaseControlProperty, tpl) {

    'use strict';

    var getValueType = function(value) {


        if( typeof(value) === 'string') {
            return 'code';
        } else if (Object.prototype.toString.call(value) === '[object Array]') {
            return 'manual';
        } else {
            throw new TypeError('was expecting a string or an array');
        }
        
    };

    var MultiOptionControlProperty = BaseControlProperty.extend({
        init: function(options) {
            options = options || {};
            this._super({
                type: 'multioption',
                label: options.label || '',
                helpText: options.helpText || '',
                defaultValue: options.defaultValue || '',
                isRequired: options.isRequired || false,
                uid: options.uid,
                className: options.className,
                value: options.value
            });

            // instead of testing for this everywhere, set a member property:
            this.optionType = getValueType(options.value);

            this.codeHelpText = options.codeHelpText || 'Enter code that retrieves the values at runtime';

        },
        render: function(childIndex) {

            var template = _.template(tpl);

            return template({
                property: this,
                childIndex: childIndex
            });

        },
        getDialogValue: function() {

            // manual or code?:
            if ($('#optionType-manual-' + this.id).is(':checked')) {

                this.optionType = 'manual';

                // return an array:
                return _.filter(
                    _.map($('#ta-manual-' + this.id).val().split('\n'), function(obj) {
                        return {
                            label: obj,
                            value: ''
                        };
                    }),
                    function(obj) {
                        return obj.label.length > 0;
                    });
            } else {

                this.optionType = 'code';

                // return a string:
                return $('#ta-code-' + this.id).val();
            }
        },
        translateValueToText: function() {
            return _.pluck(this.value, 'label').join('\n');
        },
        finalise : function() {
            this.optionType = getValueType(this.value);
        }
    });

    return MultiOptionControlProperty;

});
