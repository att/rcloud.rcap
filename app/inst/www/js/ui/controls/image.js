define(['rcap/js/ui/controls/baseControl', 'rcap/js/ui/controls/controlProperty',
	'rcap/js/ui/controls/properties/textControlProperty'], function(BaseControl, ControlProperty, TextControlProperty) {
	
	'use strict';

	var ImageControl = BaseControl.extend({
		init: function() {
			this._super({
				type : 'image',
				label : 'Image',
				icon: 'f03e',  
				inlineIcon: 'picture',
				initialSize: [2, 2],
				controlProperties: [
					new TextControlProperty({
						uid: 'imagesource',
						label : 'Image source',
						defaultValue : '',
						helpText : 'The source of this image'
					})
				]
			});
		}
	});

	return ImageControl;

});