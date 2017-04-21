define(['rcap/js/ui/controls/baseControl', 'rcap/js/ui/properties/textProperty',
    'rcap/js/ui/properties/dropdownProperty',
    'text!rcap/js/ui/controls/child/templates/dateRange.tpl'], function(BaseControl, TextProperty, DropdownProperty, tpl) {

    'use strict';

    var DatePickerControl = BaseControl.extend({
        init: function() {
            this._super({
                type : 'daterange',
                label : 'Date Range',
                icon: 'tags',
                controlProperties: [
                    new TextProperty({
                        uid: 'label',
                        label : 'Label',
                        defaultValue : 'Label',
                        helpText : 'The label for this range control',
                        isHorizontal: false
                    }),
                    new DropdownProperty({
                        uid: 'intervalType',
                        label: 'Use interval',
                        helpText: 'If an interval type is specified, a start date plus interval will be shown rather than the start/end date',
                        isRequired: false,
                        availableOptions: [{
                            text: 'Days',
                            value: 'days'
                        }, {
                            text: 'Weeks',
                            value: 'weeks'
                        }, {
                            text: 'Months',
                            value: 'months'
                        }, {
                            text: 'Years',
                            value: 'years'
                        }],
                        isHorizontal: false
                    }),
                    new TextProperty({
                        uid: 'variablename',
                        label : 'Start/end date variable name',
                        defaultValue : 'variable',
                        helpText : 'The start/end date variable',
                        isRequired: true,
                        isHorizontal: false
                    })
                ]
            });
        },
        singularInterval: function() {
            var intervalType = this.getPropertyValue('intervalType');
            return intervalType ? intervalType.substring(0, intervalType.length - 1) : '';
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
