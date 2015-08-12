define(['rcap/js/ui/controls/baseControl', 'rcap/js/ui/controls/properties/textControlProperty',
	'rcap/js/ui/controls/properties/dropdownControlProperty',
	'rcap/js/ui/controls/properties/colorControlProperty'], function(BaseControl, TextControlProperty, DropdownControlProperty, ColorControlProperty) {
	
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
						label : 'Source',
						defaultValue : '',
						helpText : 'The URL that the iFrame will show',
						isRequired : true
					}),
					new DropdownControlProperty({
						label : 'Test dropdown',
						helpText : 'This is for testing purposes only',
						isRequired : true,
						availableOptions : [{
							text: 'Option 1',
							value: '1'
						}, {
							text: 'Option 2',
							value: '2'
						}
						]
					}),
					new ColorControlProperty({
						label : 'Border color',
						helpText : 'The color of the border for this control'
					}),
					new ColorControlProperty({
						label : 'Background color',
						helpText : 'The color of the background for this control'	
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