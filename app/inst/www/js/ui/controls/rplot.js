define(['rcap/js/ui/controls/gridControl', 
	'rcap/js/ui/controls/properties/textControlProperty',
	'rcap/js/ui/controls/properties/multilineTextControlProperty',
	'text!controlTemplates/rPlot.tpl',
	'text!controlTemplates/rPlot-design.tpl'], function(GridControl, TextControlProperty, MultilineTextControlProperty, tpl, dtpl) {
	
	'use strict';

	var RPlotControl = GridControl.extend({
		init: function() {
			this._super({
				type : 'rplot',
				label : 'R Plot',
				icon: 'f012',  
				inlineIcon: 'signal',
				initialSize: [2, 2],
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
		},
		render: function(options) {

			options = options || {};
			var isDesignTime = options.isDesignTime || false;

            var template = isDesignTime ? _.template(tpl) : _.template(dtpl);

            return template({
                control: this
            });

		}
	});

	return RPlotControl;

});