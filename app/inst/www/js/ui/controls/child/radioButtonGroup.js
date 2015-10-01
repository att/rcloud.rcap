define(['rcap/js/ui/controls/baseControl',
    'rcap/js/ui/controls/properties/textControlProperty',
    'rcap/js/ui/controls/properties/multiOptionControlProperty',
    'text!rcap/js/ui/controls/child/templates/radioButtonGroup.tpl'
], function(BaseControl, TextControlProperty, MultiOptionControlProperty, tpl) {

    'use strict';

    var RadioButtonGroupControl = BaseControl.extend({
        init: function() {

            this._super({
                type: 'radiobuttongroup',
                label: 'Radio Button Group',
                icon: 'f10c',
                inlineIcon: 'circle-blank',
                controlProperties: [
                    new TextControlProperty({
                        uid: 'description',
                        label: 'Description',
                        defaultValue: 'Description',
                        helpText: 'Instructions / help text for this control'
                    }),
                    new TextControlProperty({
                        uid: 'variablename',
                        label: 'Variable name',
                        defaultValue: 'variable',
                        helpText: 'The variable associated with this control',
                        isRequired: true
                    }),
                    // options:
                    new MultiOptionControlProperty({
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
                        isRequired: true
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

    return RadioButtonGroupControl;

});