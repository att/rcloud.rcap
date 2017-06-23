define(['rcap/js/ui/controls/baseControl', 'rcap/js/ui/properties/textProperty',
	'rcap/js/ui/properties/colorProperty', 'text!rcap/js/ui/controls/child/templates/datePicker.tpl'], function(BaseControl, TextProperty, ColorProperty, tpl) {
	
	'use strict';

	var DatePickerControl = BaseControl.extend({
		init: function() {
			this._super({
				type : 'datepicker',
				label : 'Date Picker',
				icon: 'calendar',
				controlProperties: [
					new TextProperty({
						uid: 'label',
						label : 'Label',
						defaultValue : 'Label',
						helpText : 'The label for this control',
						isHorizontal: false
					}),
					new TextProperty({
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