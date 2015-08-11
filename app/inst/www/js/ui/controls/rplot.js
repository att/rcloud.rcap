define(['rcap/js/ui/controls/baseControl', 'rcap/js/ui/controls/controlProperty'], function(BaseControl, ControlProperty) {
	
	'use strict';

	var RPlotControl = BaseControl.extend({
		init: function() {
			this._super({
				type : 'rplot',
				label : 'R Plot',
				icon: "f012",  
				inlineIcon: "signal",
				initialSize: [3, 3]
			});
		}
	});

	return RPlotControl;

});