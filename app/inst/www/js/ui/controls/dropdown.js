define(['rcap/js/ui/controls/baseControl', 'rcap/js/ui/controls/controlProperty',
	'rcap/js/ui/controls/properties/textControlProperty',
	'rcap/js/ui/controls/properties/colorControlProperty'], function(BaseControl, ControlProperty, TextControlProperty, ColorControlProperty) {
	
	'use strict';

	var DropdownControl = BaseControl.extend({
		init: function() {
			this._super({
				type : 'dropdown',
				label : 'Dropdown',
				icon: 'f00b',  
				inlineIcon: 'list',
				initialSize: [2, 1],
				controlProperties: [
					new TextControlProperty({
						label : 'Label',
						defaultValue : '',
						helpText : 'The label for the dropdown'
					}),
					new TextControlProperty({
						label : 'Variable name',
						defaultValue : '',
						helpText : 'The variable associated with this control'
					}),
					new ColorControlProperty({
						label : 'Background color',
						helpText : 'The color of the background for this control'	
					})
				]
			});
		}
	});

	return DropdownControl;

});