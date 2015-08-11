define(['rcap/js/ui/controls/baseControl', 'rcap/js/ui/controls/controlProperty'], function(BaseControl, ControlProperty) {
	
	'use strict';

	var TextControl = BaseControl.extend({
		init: function() {
			this._super({
				type : 'text',
				label : 'Text',
				icon: "f044",  
				inlineIcon: "pencil",
				initialSize: [3, 2]
			});
		}
	});

	return TextControl;

});