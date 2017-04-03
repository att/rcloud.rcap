define(['rcap/js/ui/controls/gridControl', 
	'rcap/js/ui/properties/textProperty',
	'rcap/js/ui/properties/wysiwygProperty'], function(GridControl, TextProperty, WysiwygProperty) {
	
	'use strict';

	var TextControl = GridControl.extend({
		init: function() {
			this._super({
				type : 'text',
				controlCategory: 'HTML',
				label : 'Text',
				icon: 'pencil',
				controlProperties: [
					new WysiwygProperty({
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