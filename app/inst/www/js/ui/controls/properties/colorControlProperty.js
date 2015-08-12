define(['rcap/js/ui/controls/properties/baseControlProperty', 
	'text!templates/colorControl.tpl', 
	'css!spectrum/spectrum', 
	'spectrum/spectrum'], function(BaseControlProperty, tpl) {
	'use strict';

	var ColorControlProperty = BaseControlProperty.extend({
		init: function(options) {
			this._super({
				type : 'color',
				label : options.label,
				helpText : options.helpText,
				defaultValue : options.defaultValue,
				isRequired : options.isRequired
			});

			// additional assignments go here:
		},
		render: function(childIndex) {

			var template = _.template(tpl);
            
            return template({
            	property : this,
            	childIndex : childIndex
            });

		},
		getDialogValue : function() {
			return $('#' + this.id).spectrum('get').toHexString();
		}
	});

	return ColorControlProperty;

});