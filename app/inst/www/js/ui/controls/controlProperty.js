define([], function() {
	
	'use strict';

	var ControlProperty = Class.extend({
		init : function(options) {
			var options = options || {};

			this.type = options.type;
			this.label = options.label;
			this.helpText = options.helpText;
			this.values = options.values;
			this.defaultValue = options.defaultValue;

		}
	});

	return ControlProperty;

});