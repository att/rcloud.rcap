define(['rcap/js/ui/controls/baseControl', 'rcap/js/ui/controls/controlProperty',
	'rcap/js/ui/controls/properties/textControlProperty',
	'rcap/js/ui/controls/properties/wysiwygControlProperty'], function(BaseControl, ControlProperty, TextControlProperty, WysiwygControlProperty) {
	
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
						uid: 'label',
						label : 'Label',
						defaultValue : '',
						helpText : 'The heading for the control'
					}),
					new WysiwygControlProperty({
						uid: 'content',
						label : 'Content',
						defaultValue : ''
					})
				]
			});
		}
	});

	return TextControl;

});