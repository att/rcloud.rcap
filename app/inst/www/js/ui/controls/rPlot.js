define(['rcap/js/ui/controls/gridControl', 
	'rcap/js/ui/controls/properties/textControlProperty',
	'rcap/js/ui/controls/properties/multilineTextControlProperty',
	'text!controlTemplates/rPlot.tpl',
	'text!controlTemplates/rPlot-design.tpl'], function(GridControl, TextControlProperty, MultilineTextControlProperty, tpl, dtpl) {
	
	'use strict';

	var RPlotControl = GridControl.extend({
		init: function() {
			this._super({
				type : 'rplot',
				label : 'R Plot',
				icon: 'f012',  
				inlineIcon: 'signal',
				initialSize: [2, 2],
				controlProperties: [
					// new TextControlProperty({
					// 	uid: 'heading',
					// 	label : 'Heading',
					// 	defaultValue : '',
					// 	helpText : 'The heading for this control'
					// }),
					// code box
					new MultilineTextControlProperty({
						uid: 'code',
						label: 'Code',
						defaultValue: '',
						helpText: 'Code for this control',
						className: 'code',
						isRequired: true
					})
				]
			});
		},
		render: function(options) {

			options = options || {};
			var isDesignTime = options.isDesignTime || false;

            var template = isDesignTime ? _.template(dtpl) : _.template(tpl);

            return template({
                control: this
            });

		},
		initialiseViewerItems: function() {
	
			/*
			var notebookResult = window.notebook_result; // jshint ignore:line

            // some controls are dependent on having a valid notebook result:
            var func = function() {
            	if (notebookResult) {
                $('.r-rplot').each(function(i, e) {
                    if (typeof notebookResult[$(e).attr('id')] === 'function') {
                        var $enclosingDiv = $(e).closest('.grid-stack-item-content');

                        notebookResult[$(e).attr('id')]({
                            width: $enclosingDiv.width() * 1.5,
                            height: $enclosingDiv.height() * 1.5
                        }, function() {});

                    } else {
                        $(e).css({
                                'color': 'red',
                                'font-weight': 'bold',
                                'border': '1px solid red'
                            })
                            .text('the function ' + $(e).attr('id') + '() does not exist...');
                    }
                });
            }};

            setTimeout(func, 0);

            //func();
			*/


			var interval = setInterval(function() {

				console.log('** testing notebook_result...');

				var notebookResult = window.notebook_result; // jshint ignore:line

            	if (notebookResult) {

            		console.log('** interval cleared');

            		clearInterval(interval);

	                $('.r-rplot').each(function(i, e) {
	                    if (typeof notebookResult[$(e).attr('id')] === 'function') {
	                        var $enclosingDiv = $(e).closest('.grid-stack-item-content');

	                        notebookResult[$(e).attr('id')]({
	                            width: $enclosingDiv.width() * 1.5,
	                            height: $enclosingDiv.height() * 1.5
	                        }, function() {});

	                    } else {
	                        $(e).css({
	                                'color': 'red',
	                                'font-weight': 'bold',
	                                'border': '1px solid red'
	                            })
	                            .text('the function ' + $(e).attr('id') + '() does not exist...');
	                    }
	                });
            	}
        	}, 1500);

            // some controls are dependent on having a valid notebook result:
            //var func = ;


            


		}
	});

	return RPlotControl;


});