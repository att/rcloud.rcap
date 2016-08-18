define(['rcap/js/ui/controls/baseControl', 'rcap/js/ui/controls/properties/textControlProperty',
    'rcap/js/ui/controls/properties/colorControlProperty', 'text!rcap/js/ui/controls/child/templates/dateRange.tpl'], function(BaseControl, TextControlProperty, ColorControlProperty, tpl) {
    
    'use strict';

    var DatePickerControl = BaseControl.extend({
        init: function() {
            this._super({
                type : 'daterange',
                label : 'Date Range',
                icon: 'tags',
                controlProperties: [
                    new TextControlProperty({
                        uid: 'label',
                        label : 'Label',
                        defaultValue : 'Label',
                        helpText : 'The label for this range control',
                        isHorizontal: false
                    }),
                    new TextControlProperty({
                        uid: 'startvariablename',
                        label : 'Start date variable name',
                        defaultValue : 'startvariable',
                        helpText : 'The start date variable',
                        isRequired: true,
                        isHorizontal: false
                    }),
                    new TextControlProperty({
                        uid: 'endvariablename',
                        label : 'End date variable name',
                        defaultValue : 'endvariable',
                        helpText : 'The end date variable',
                        isRequired: true,
                        isHorizontal: false
                    })
                ]
            });
        },
        render: function() {
            var template = _.template(tpl);

            return template({
                control: this
            });
        }
    });

    return DatePickerControl;

});