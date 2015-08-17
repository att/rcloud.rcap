define(['rcap/js/ui/controls/baseControl', 'rcap/js/ui/controls/controlProperty',
	'rcap/js/ui/controls/properties/textControlProperty'], function(BaseControl, ControlProperty, TextControlProperty) {
	
	'use strict';

	var WebPlotControl = BaseControl.extend({
		init: function() {
			this._super({
				type : 'webplot',
				label : 'Web Plot',
				icon: 'f080',  
				inlineIcon: 'bar-chart',
				initialSize: [3, 3],
				controlProperties: [
					new TextControlProperty({
						uid: 'label',
						label : 'Label',
						defaultValue : '',
						helpText : 'The label for the date picker'
					})
				]
			});
		}
	});

	return WebPlotControl;

});