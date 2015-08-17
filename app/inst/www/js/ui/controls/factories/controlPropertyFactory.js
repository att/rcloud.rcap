define([
	'rcap/js/ui/controls/properties/colorControlProperty',
	'rcap/js/ui/controls/properties/dropdownControlProperty',
	'rcap/js/ui/controls/properties/textControlProperty',
	'rcap/js/ui/controls/properties/wysiwygControlProperty'
	], function(ColorControlProperty, DropdownControlProperty, TextControlProperty, WysiwygControlProperty) {
	
	'use strict';

	function ControlPropertyFactory()  {
		this.controlProperties = [
			new ColorControlProperty(),
			new DropdownControlProperty(),
			new TextControlProperty(),
			new WysiwygControlProperty()
		];
	}

	ControlPropertyFactory.prototype.getAll = function() {
		return this.controlProperties;
	};

	ControlPropertyFactory.prototype.getByKey = function(key) {
		// TODO: improve this (each 'controlProperty' knows its own string identity...)

		var controlProperty;

		switch(key){
			case 'color': controlProperty = new ColorControlProperty(); break;
			case 'dropdown': controlProperty = new DropdownControlProperty(); break;
			case 'text': controlProperty = new TextControlProperty(); break;
			case 'wysiwyg': controlProperty = new WysiwygControlProperty(); break;
			default: controlProperty = undefined; break;
		}

		return controlProperty;
	};

	return ControlPropertyFactory;

});