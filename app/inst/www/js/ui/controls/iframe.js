define(['rcap/js/ui/controls/baseControl', 'rcap/js/ui/controls/properties/textControlProperty'], function(BaseControl, TextControlProperty) {
	
	'use strict';

	var IFrameControl = BaseControl.extend({
		init: function() {
			this._super({
				type : 'iframe',
				label : 'iFrame',
				icon: 'f0c2',  
				inlineIcon: 'cloud',
				initialSize: [6, 3],
				controlProperties: [
					new TextControlProperty({
						type : 'text',
						label : 'Source',
						defaultValue : '',
						helpText : 'The URL that the iFrame will show'
					})
				]
			});
		},
		getConfigurationMarkup : function() {
			return '<p><i class="icon-' + this.inlineIcon + '"></i>' + (this.controlProperties[0].value || '') + '</p>';			
		}
	});

	return IFrameControl;

});