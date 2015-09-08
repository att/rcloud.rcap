define(['rcap/js/ui/controls/baseControl', 'rcap/js/ui/controls/properties/textControlProperty',
	'rcap/js/ui/controls/properties/colorControlProperty', 'text!rcap/js/ui/controls/child/templates/datePicker.tpl'], function(BaseControl, TextControlProperty, ColorControlProperty, tpl) {
	
	'use strict';

	var DatePickerControl = BaseControl.extend({
		init: function() {
			this._super({
				type : 'datepicker',
				label : 'Date Picker',
				icon: 'f073',  
				inlineIcon: 'calendar',
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
						defaultValue : '',
						helpText : 'The variable associated with this control',
						isRequired: true
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