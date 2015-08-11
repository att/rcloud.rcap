define(['rcap/js/ui/controls/baseControl', 'rcap/js/ui/controls/controlProperty'], function(BaseControl, ControlProperty) {
	
	'use strict';

	var WebPlotControl = BaseControl.extend({
		init: function() {
			this._super({
				type : 'webplot',
				label : 'Web Plot',
				icon: "f080",  
				inlineIcon: "bar-chart",
				initialSize: [3, 3]
			});
		}
	});

	return WebPlotControl;

});