define(['rcap/js/ui/controls/gridControl',
	'rcap/js/ui/controls/properties/textControlProperty'], function(GridControl, TextControlProperty) {
	
	'use strict';

	var WebPlotControl = GridControl.extend({
		init: function() {
			this._super({
				type : 'webplot',
				label : 'Web Plot',
				icon: 'f080',  
				inlineIcon: 'bar-chart',
				initialSize: [2, 2],
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