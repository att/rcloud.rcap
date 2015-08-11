define(['rcap/js/ui/controls/properties/baseControlProperty', 'text!templates/textControl.tpl'], function(BaseControlProperty, tpl) {
	
	'use strict';

	var TextControlProperty = BaseControlProperty.extend({
		init: function(options) {
			this._super({
				type : options.type,
				label : options.label,
				helpText : options.helpText,
				defaultValue : options.defaultValue
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
			return $('#form-group-' + this.id).find('input').val();
		}
	});

	return TextControlProperty;

});