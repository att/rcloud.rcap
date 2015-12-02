define(['rcap/js/ui/controls/baseControl', 'rcap/js/ui/controls/properties/textControlProperty',
	'rcap/js/ui/controls/properties/colorControlProperty', 'text!rcap/js/ui/controls/child/templates/datePicker.tpl'], function(BaseControl, TextControlProperty, ColorControlProperty, tpl) {
	
	'use strict';

	var DatePickerControl = BaseControl.extend({
		init: function() {
			this._super({
				type : 'datepicker',
				label : 'Date Picker',
				icon: 'calendar',
				controlProperties: [
					new TextControlProperty({
						uid: 'label',
						label : 'Label',
						defaultValue : 'Label',
						helpText : 'The label for this control',
						isHorizontal: false
					}),
					new TextControlProperty({
						uid: 'variablename',
						label : 'Variable name',
						defaultValue : 'variable',
						helpText : 'The variable associated with this control',
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