define(['rcap/js/ui/controls/baseControl', 
	'rcap/js/ui/controls/properties/textControlProperty',
	'rcap/js/ui/controls/properties/multilineTextControlProperty'], function(BaseControl, TextControlProperty, MultilineTextControlProperty) {
	
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
						uid: 'heading',
						label : 'Heading',
						defaultValue : '',
						helpText : 'The heading for this control'
					}),
					// code box
					new MultilineTextControlProperty({
						uid: 'code',
						label: 'Code',
						defaultValue: '',
						helpText: 'Code for this control',
						className: 'code'
					})
				]
			});
		}
	});

	return RPlotControl;

});