define(['rcap/js/ui/controls/baseControl', 'rcap/js/ui/controls/properties/textControlProperty', 
	'text!rcap/js/ui/controls/child/templates/textField.tpl'], function(BaseControl, TextControlProperty, tpl) {

    'use strict';

    var TextFieldControl = BaseControl.extend({
        init: function() {
            this._super({
                type: 'textfield',
                label: 'Text Field',
                icon: 'check-empty',
                controlProperties: [
                    new TextControlProperty({
                        uid: 'label',
                        label : 'Label',
                        defaultValue : 'Label',
                        helpText : 'The label for this control'
                    }),
                    new TextControlProperty({
                        uid: 'variablename',
                        label : 'Variable name',
                        defaultValue : 'variable',
                        helpText : 'The variable associated with this control',
                        isRequired: true
                    }),
                    new TextControlProperty({
                        uid: 'text',
                        label: 'Default text',
                        defaultValue: ''
                    })
                ]
            });
        },
		render: function() {
			var template = _.template(tpl);

            return template({
                text: this.getControlPropertyValueOrDefault('text'),
                control: this
            });
		}
    });

    return TextFieldControl;

});