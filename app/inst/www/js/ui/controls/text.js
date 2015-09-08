define(['rcap/js/ui/controls/gridControl', 
	'rcap/js/ui/controls/properties/textControlProperty',
	'rcap/js/ui/controls/properties/wysiwygControlProperty'], function(GridControl, TextControlProperty, WysiwygControlProperty) {
	
	'use strict';

	var TextControl = GridControl.extend({
		init: function() {
			this._super({
				type : 'text',
				label : 'Text',
				icon: 'f044',  
				inlineIcon: 'pencil',
				initialSize: [2, 2],
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
		},
		render: function() {
			return this.controlProperties[1].value;
		}
	});

	return TextControl;

});