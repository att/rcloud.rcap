define(['rcap/js/ui/controls/baseControl', 'rcap/js/ui/controls/controlProperty'], function(BaseControl, ControlProperty) {
	
	'use strict';

	var DatePickerControl = BaseControl.extend({
		init: function() {
			this._super({
				type : 'datepicker',
				label : 'Date Picker',
				icon: "f073",  
				inlineIcon: "calendar",
				initialSize: [2, 1]
			});
		}
	});

	return DatePickerControl;

});