define(['rcap/js/ui/controls/baseControl', 'rcap/js/ui/controls/controlProperty',
	'rcap/js/ui/controls/properties/textControlProperty'], function(BaseControl, ControlProperty, TextControlProperty) {
	
	'use strict';

	var TextControl = BaseControl.extend({
		init: function() {
			this._super({
				type : 'text',
				label : 'Text',
				icon: 'f044',  
				inlineIcon: 'pencil',
				initialSize: [3, 2],
				controlProperties: [
					new TextControlProperty({
						label : 'Label',
						defaultValue : '',
						helpText : 'The heading for the control'
					})
				]
			});
		}
	});

	return TextControl;

});