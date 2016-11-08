define(['rcap/js/ui/properties/baseProperty', 'text!templates/multlineTextControl.tpl'], function(BaseProperty, tpl) {
	
	'use strict';

	var MultiLineTextProperty = BaseProperty.extend({
		init: function(options) {
			options = options || {};
			this._super({
				type : 'multilinetext',
				label : options.label || '',
				helpText : options.helpText || '',
				defaultValue : options.defaultValue || '',
				isRequired : options.isRequired || false,
				uid : options.uid,
				className : options.className,
				value: options.value
			});

			// additional assignments go here:
			this.rows = options.rows || 10;
			this.cols = options.cols || 80;
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

	return MultiLineTextProperty;

});