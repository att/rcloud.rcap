define([
	'props/colorControlProperty',
	'props/dropdownControlProperty',
	'props/textControlProperty',
	'props/wysiwygControlProperty'
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

	ControlFactory.prototype.getAll = function() {
		return this.controlProperties;
	};

	ControlFactory.prototype.getByKey = function(key) {
		// TODO: improve this (each 'control' knows its own string identity...)

		var controlProperty;

		switch(key){
			case 'color': control = new ColorControlProperty(); break;
			case 'dropdown': control = new DropdownControlProperty(); break;
			case 'text': control = new TextControlProperty(); break;
			case 'wysiwyg': control = new WysiwygControlProperty(); break;
			default: control = undefined; break;
		}

		return control;
	};

	return ControlFactory;

});