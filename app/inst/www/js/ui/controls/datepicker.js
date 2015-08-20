define(['rcap/js/ui/controls/baseControl', 'rcap/js/ui/controls/properties/textControlProperty',
	'rcap/js/ui/controls/properties/colorControlProperty'], function(BaseControl, TextControlProperty, ColorControlProperty) {
	
	'use strict';

	var DatePickerControl = BaseControl.extend({
		init: function() {
			this._super({
				type : 'datepicker',
				label : 'Date Picker',
				icon: 'f073',  
				inlineIcon: 'calendar',
				initialSize: [2, 1],
				controlProperties: [
					new TextControlProperty({
						uid: 'label',
						label : 'Label',
						defaultValue : '',
						helpText : 'The label for the date picker'
					}),
					new TextControlProperty({
						uid: 'variablename',
						label : 'Variable name',
						defaultValue : '',
						helpText : 'The variable associated with this control'
					}),
					new ColorControlProperty({
						uid: 'backgroundcolor',
						label : 'Background color',
						helpText : 'The color of the background for this control'	
					})
				]
			});
		}
	});

	return DatePickerControl;

});