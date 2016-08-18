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
                        uid: 'variable',
                        label : 'Start/end date variable name',
                        defaultValue : 'variable',
                        helpText : 'The start/end date variable',
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