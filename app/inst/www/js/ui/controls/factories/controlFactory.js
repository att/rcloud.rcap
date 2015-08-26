define([
	'controls/datePicker',
	//'controls/dropdown',
	'controls/iframe',
	'controls/image',
	'controls/rPlot',
	'controls/text',
	'controls/webPlot',
	'controls/form'
	], function(DatePickerControl, /*DropdownControl,*/ IFrameControl, ImageControl, RPlotControl, TextControl, WebPlotControl, FormControl) {
	
	'use strict';

	function ControlFactory()  {
		this.controls = [
			new DatePickerControl(),
			//new DropdownControl(),
			new IFrameControl(),
			new ImageControl(),
			new RPlotControl(),
			new TextControl(),
			new WebPlotControl(),
			new FormControl()
		];
	}

	ControlFactory.prototype.getAll = function() {
		return this.controls;
	};

	ControlFactory.prototype.getByKey = function(key) {
		// TODO: improve this (each 'control' knows its own string identity...)

		var control;

		switch(key){
			case 'datepicker': control = new DatePickerControl(); break;
			//case 'dropdown': control = new DropdownControl(); break;
			case 'iframe': control = new IFrameControl(); break;
			case 'image': control = new ImageControl(); break;
			case 'rplot': control = new RPlotControl(); break;
			case 'text': control = new TextControl(); break;
			case 'webplot': control = new WebPlotControl(); break;
			case 'form': control = new FormControl(); break;
			default: control = undefined; break;
		}

		return control;
	};

	return ControlFactory;

});