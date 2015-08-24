define(['rcap/js/ui/controls/baseControl', 'rcap/js/ui/controls/properties/textControlProperty'], 
	function(BaseControl, TextControlProperty) {
	
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
						helpText : 'The source of this image',
						isRequired: true
					})
				]
			});
		},
		render: function() {
			return '<img src="' + this.controlProperties[0].value + '" />';
		}
	});

	return ImageControl;

});