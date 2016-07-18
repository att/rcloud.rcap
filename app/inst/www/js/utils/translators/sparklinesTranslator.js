define([
    
], function() {

    'use strict';
    // This class only contains one method, and no state
    // It translates between the options returned by R
    // and works with the jquery sparkline api
    var SparklinesTranslator = function() {
        // sparklineOptions is an object with elements named
        // bar, line and box. 
        // The default is 
        this.translate = function(sparklineOptions) {
            var barFunc = function (oSettings, json) { 
                $('.spark:not(:has(canvas))').sparkline('html', { 
                    type: 'bar', 
                    barColor: 'orange', 
                    negBarColor: 'purple', 
                    highlightColor: 'black'
                }); 
            }
            var lineFunc = function (oSettings, json) { 
              $('.spark:not(:has(canvas))').sparkline('html', { 
                type: 'line', 
                lineColor: 'black', 
                fillColor: '#ccc', 
                highlightLineColor: 'orange', 
                highlightSpotColor: 'orange'
              }); 
            }
            var boxFunc = function (oSettings, json) {
                $('.spark:not(:has(canvas))').sparkline('html', { 
                    type: 'box', 
                    lineColor: 'black', 
                    whiskerColor: 'black', 
                    outlierFillColor: 'black', 
                    outlierLineColor: 'black', 
                    medianColor: 'black', 
                    boxFillColor: 'orange', 
                    boxLineColor: 'black'
                }); 
            }


            return {             
                columnDefs : [{
                    render: function(data, type, full){ 
                        return '<span class=sparkbox>' + data + '</span>' 
                    },
                    target: sparklineOptions.box
                }, {
                    render: function(data, type, full){ 
                        return '<span class=sparkline>' + data + '</span>' 
                    },
                    target: sparklineOptions.line                
                },{
                    render: function(data, type, full){ 
                        return '<span class=sparkbar>' + data + '</span>' 
                    },
                    target: sparklineOptions.bar
                }],
                fnDrawCallback: function (oSettings, json) {
                    barFunc(oSettings, json);
                    lineFunc(oSettings, json);
                    boxFunc(oSettings, json);
                }
              };
        };
    };

  return SparklinesTableTranslator;

});