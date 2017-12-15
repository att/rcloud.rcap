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
            var barFunc = function () { 
                $('.sparkbar:not(:has(canvas))').sparkline('html', { 
                    type: 'bar', 
                    barColor: 'orange', 
                    negBarColor: 'purple', 
                    highlightColor: 'black'
                }); 
            };
            var lineFunc = function () { 
              $('.sparkline:not(:has(canvas))').sparkline('html', { 
                type: 'line', 
                lineColor: 'black', 
                fillColor: '#ccc', 
                highlightLineColor: 'orange', 
                highlightSpotColor: 'orange'
              }); 
            };
            var boxFunc = function () {
                $('.sparkbox:not(:has(canvas))').sparkline('html', { 
                    type: 'box', 
                    lineColor: 'black', 
                    whiskerColor: 'black', 
                    outlierFillColor: 'black', 
                    outlierLineColor: 'black', 
                    medianColor: 'black', 
                    boxFillColor: 'orange', 
                    boxLineColor: 'black'
                }); 
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
                    barFunc();
                    lineFunc();
                    boxFunc();
                }
              };
        };
    };

  return SparklinesTranslator;

});