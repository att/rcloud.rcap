define(['rcap/js/ui/controls/baseControl', 'rcap/js/ui/controls/controlProperty'], function(BaseControl, ControlProperty) {
	
	'use strict';

	var DropdownControl = BaseControl.extend({
		init: function() {
			this._super({
				type : 'dropdown',
				label : 'Dropdown',
				icon: "f00b",  
				inlineIcon: "icon-list",
				initialSize: [2, 1]
			});
		}
	});

	return DropdownControl;

});