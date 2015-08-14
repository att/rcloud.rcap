define(['rcap/js/ui/controls/baseControl', 'rcap/js/ui/controls/controlProperty',
	'rcap/js/ui/controls/properties/textControlProperty'], function(BaseControl, ControlProperty, TextControlProperty) {
	
	'use strict';

	var RPlotControl = BaseControl.extend({
		init: function() {
			this._super({
				type : 'rplot',
				label : 'R Plot',
				icon: 'f012',  
				inlineIcon: 'signal',
				initialSize: [3, 3],
				controlProperties: [
					new TextControlProperty({
						label : 'Heading',
						defaultValue : '',
						helpText : 'The heading for this control'
					})
				]
			});
		}
	});

	return RPlotControl;

});