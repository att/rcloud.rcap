define(['rcap/js/ui/controls/baseControl'], function(BaseControl) {
	
	'use strict';

	var SeparatorControl = BaseControl.extend({
		init: function() {
			this._super({
				type : 'separator',
				label : 'Separator',
				icon: 'f141',  
				inlineIcon: 'ellipsis-horizontal',
				controlProperties: [
					
				]
			});
		},
		render: function() {
			return '<hr />';
		}
	});

	return SeparatorControl;

});