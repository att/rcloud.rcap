define(['rcap/js/ui/controls/baseControl', 'rcap/js/ui/controls/controlProperty'], function(BaseControl, ControlProperty) {
	
	'use strict';

	var ImageControl = BaseControl.extend({
		init: function() {
			this._super({
				type : 'image',
				label : 'Image',
				icon: "f03e",  
				inlineIcon: "picture",
				initialSize: [2, 2]
			});
		}
	});

	return ImageControl;

});