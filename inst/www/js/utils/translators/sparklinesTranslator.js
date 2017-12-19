define([
    
], function() {

    'use strict';
    // This class only contains one method, and no state
    // It translates between the options returned by R
    // and works with the jquery sparkline api
    var SparklinesTranslator = function() {
        // sparklineOptions is an object with elements named
        // bar, line and box. 
        // The default is box.
        this.translate = function(sparklineOptions) {
            var options = sparklineOptions.options;
            var barFunc = function (options) { 
                $('.sparkbar:not(:has(canvas))').sparkline('html', $.extend({ 
                    type: 'bar', 
                    barColor: 'orange', 
                    negBarColor: 'purple', 
                    highlightColor: 'black',
                    height: '18px'
                }, options)); 
            };
            var lineFunc = function (options) { 
              $('.sparkline:not(:has(canvas))').sparkline('html', $.extend({ 
                type: 'line', 
                lineColor: 'black', 
                fillColor: '#ccc', 
                highlightLineColor: 'orange', 
                highlightSpotColor: 'orange',
                height: '18px'
              }, options)); 
            };
            var boxFunc = function (options) {
                $('.sparkbox:not(:has(canvas))').sparkline('html', $.extend({ 
                    type: 'box', 
                    lineColor: 'black', 
                    whiskerColor: 'black', 
                    outlierFillColor: 'black', 
                    outlierLineColor: 'black', 
                    medianColor: 'black', 
                    boxFillColor: 'orange', 
                    boxLineColor: 'black',
                    height: '18px'
                }, options)); 
            };

            return {             
                columnDefs : [{
                    render: function(data){ 
                        return '<span class="sparkgraph sparkbox">' + data + '</span>';
                    },
                    targets: sparklineOptions.box
                }, {
                    render: function(data){ 
                        return '<span class="sparkgraph sparkline">' + data + '</span>';
                    },
                    targets: sparklineOptions.line                
                },{
                    render: function(data){ 
                        return '<span class="sparkgraph sparkbar">' + data + '</span>';
                    },
                    targets: sparklineOptions.histogram
                }],
                fnDrawCallback: function () {
                    barFunc(options);
                    lineFunc(options);
                    boxFunc(options);
                }
              };
        };
    };

  return SparklinesTranslator;

});