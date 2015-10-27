define(['rcap/js/ui/controls/properties/baseControlProperty', 'text!templates/autocomplete.tpl'], function(BaseControlProperty, tpl) {
	
	'use strict';

	var AutocompleteControlProperty = BaseControlProperty.extend({
		init: function(options) {
			options = options || {};
			this._super({
				type : 'autocomplete',
				label : options.label || '',
				helpText : options.helpText || '',
				defaultValue : options.defaultValue || '',
				isRequired : options.isRequired || false,
				uid : options.uid,
				className : options.className,
				value: options.value
			});

			this.serviceName = options.serviceName || 'getRFunctions';
		},
		render: function(childIndex) {

			var template = _.template(tpl);
            
            return template({
            	property : this,
            	childIndex : childIndex
            });

		},
		getDialogValue : function() {
			return $('#' + this.id).val();
		}
	});

	return AutocompleteControlProperty;

});