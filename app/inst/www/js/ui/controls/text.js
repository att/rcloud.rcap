define(['rcap/js/ui/controls/gridControl', 
	'rcap/js/ui/controls/properties/textControlProperty',
	'rcap/js/ui/controls/properties/wysiwygControlProperty'], function(GridControl, TextControlProperty, WysiwygControlProperty) {
	
	'use strict';

	var TextControl = GridControl.extend({
		init: function() {
			this._super({
				type : 'text',
				label : 'Text',
				icon: 'pencil',
				initialSize: [2, 2],
				controlProperties: [
					new WysiwygControlProperty({
						uid: 'content',
						label : 'Content',
						defaultValue : '',
						isRequired: true
					})
				]
			});
		},
		render: function() {
			return this.controlProperties[0].value;
		}
	});

	return TextControl;

});