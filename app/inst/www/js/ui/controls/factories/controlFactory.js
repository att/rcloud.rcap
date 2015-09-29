define([
	'controls/iframe',
	'controls/image',
	'controls/rPlot',
	'controls/text',
	'controls/pageMenu',
	'controls/interactivePlot',
	'controls/form',
	//////////////////////
	'controls/child/datePicker',
	'controls/child/dropdown',
	'controls/child/separator',
	'controls/child/heading',
	'controls/child/checkboxList',
	'controls/child/radioButtonGroup'

	], function(IFrameControl, ImageControl, RPlotControl, TextControl, PageMenuControl, InteractivePlotControl, FormControl,
		///////////////////////
		DatePickerControl, 
		DropdownControl,
		SeparatorControl,
		HeadingControl,
		CheckboxListControl,
		RadioButtonGroup) {
	
	'use strict';

	function ControlFactory()  {
		this.gridControls = [
			new IFrameControl(),
			new ImageControl(),
			new RPlotControl(),
			new TextControl(),
			new PageMenuControl(),
			new InteractivePlotControl(),
			new FormControl(),

			//new DatePickerControl(),
			//new DropdownControl(),
		];

		this.childControls = [
			new DatePickerControl(),
			new DropdownControl(),
			new SeparatorControl(),
			new HeadingControl(),
			new CheckboxListControl(),
			new RadioButtonGroup()
		];
	}

	ControlFactory.prototype.getGridControls = function() {
		return this.gridControls;
	};

	ControlFactory.prototype.getChildControls = function() {
		return this.childControls;
	};

	// ControlFactory.prototype.getAll = function() {
	// 	return this.controls;
	// };

	ControlFactory.prototype.getByKey = function(key) {
		// TODO: improve this (each 'control' knows its own string identity...)

		var control;

		switch(key){
			//case 'datepicker': control = new DatePickerControl(); break;
			//case 'dropdown': control = new DropdownControl(); break;
			case 'iframe': control = new IFrameControl(); break;
			case 'image': control = new ImageControl(); break;
			case 'rplot': control = new RPlotControl(); break;
			case 'interactiveplot': control = new InteractivePlotControl(); break;
			case 'text': control = new TextControl(); break;
			case 'pagemenu': control = new PageMenuControl(); break;
			case 'form': control = new FormControl(); break;
			default: control = undefined; break;
		}

		return control;
	};

	ControlFactory.prototype.getChildByKey = function(key) {
		// TODO: improve this (each 'control' knows its own string identity...)

		var control;

		switch(key){
			case 'datepicker': control = new DatePickerControl(); break;
			case 'dropdown': control = new DropdownControl(); break;
			case 'heading': control = new HeadingControl(); break;
			case 'separator': control = new SeparatorControl(); break;
			case 'checkboxlist': control = new CheckboxListControl(); break;
			case 'radiobuttongroup': control = new RadioButtonGroup(); break;
			default: control = undefined; break;
		}

		return control;
	};


	return ControlFactory;

});