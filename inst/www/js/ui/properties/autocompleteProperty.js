define(['rcap/js/ui/properties/baseProperty', 'text!templates/autocomplete.tpl'], function(BaseProperty, tpl) {

	'use strict';

	var AutocompleteProperty = BaseProperty.extend({
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
			this.isHorizontal = _.isUndefined(options.isHorizontal) ? true : options.isHorizontal;
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

	return AutocompleteProperty;

});
