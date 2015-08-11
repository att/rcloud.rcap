define([], function() {
	
	'use strict';

	var BaseControl = Class.extend({
		init : function(options) {
			var options = options || {};
			this.type = options.type;
			this.label = options.label;
			this.x = options.x;
			this.y = options.y;
			this.width = options.width || 2;
			this.height = options.height || 1;
			this.identifier = options.identifier;
			this.icon = options.icon;
			this.inlineIcon = options.inineIcon;
			this.initialSize = options.initialSize || [2, 1];
			this.controlProperties = options.controlProperties;

			// generate a random ID:
			this.id = Math.random().toString(16).slice(2);

		},
		initialWidth : function() {
			return this.initialSize[0];
		},
		initialHeight : function() {
			return this.initialSize[1];
		},
		deserialize : function() {

		},
		serialize : function() {

		},
		render : function() {

		},
		getConfigurationMarkup : function() {
			return '<p><i class="' + this.inlineIcon + '"></i>' + this.id + ' ' + this.label + '</p>';
		},
		getDialogMarkup : function() {
			var html = '';

            $.each(this.controlProperties, function(key, prop){ 
                html += prop.render(key);
            });

            return html;
		},
		getDialogValue : function() {
			return '';
		}
	});

	return BaseControl;

});