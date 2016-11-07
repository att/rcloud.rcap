define(['rcap/js/ui/controls/baseControl',
    'rcap/js/ui/properties/textProperty',
    'rcap/js/ui/properties/multiOptionProperty',
    'text!rcap/js/ui/controls/child/templates/checkboxList.tpl'
], function(BaseControl, TextProperty, MultiOptionProperty, tpl) {

    'use strict';

    var CheckboxListControl = BaseControl.extend({
        init: function() {

            this._super({
				type : 'checkboxlist',
				label : 'Checkbox Group',
				icon: 'check',
                controlProperties: [
                    new TextProperty({
                        uid: 'description',
                        label: 'Description',
                        defaultValue: 'Description',
                        helpText: 'Instructions / help text for this control',
                        isHorizontal: false
                    }),
                    new TextProperty({
                        uid: 'variablename',
                        label : 'Variable name',
                        defaultValue : 'variable',
                        helpText : 'The variable associated with this control',
                        isRequired: true,
                        isHorizontal: false
                    }),
                    // options:
                    new MultiOptionProperty({
                        uid: 'options',
                        label: 'Options',
                        helpText: 'Enter options, one per line',
                        value: [{
                            label: 'Option 1',
                            value: '1'
                        }, {
                            label: 'Option 2',
                            value: '2'
                        }],
                        isRequired: true,
                        isHorizontal: false
                    })
                ]
            });
        },
        render: function(options) {

            options = options || {};

            var template = _.template(tpl);

            return template({
                control: this,
                isDesignTime: options.isDesignTime || false
            });
        }

    });

    return CheckboxListControl;

});
