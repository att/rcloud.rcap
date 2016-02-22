define([
    
], function() {

    'use strict';

    var DataTableTranslator = function() {

        this.translate = function(sourceData) {

            var dataObject = JSON.parse(sourceData);

            // loop through the object's keys (they're the columns):
            var columnNames = Object.keys(dataObject);
            var columnCount = columnNames.length;
            var rowCount = dataObject[Object.keys(dataObject)[0]].length;

            var translatedData = [], currentItem = [], rowLoop = 0, columnLoop = 0;

            for(rowLoop = 0; rowLoop < rowCount; rowLoop++) {

                // create a new object:
                currentItem = [];
                for(columnLoop = 0; columnLoop < columnCount; columnLoop++) {
                    //currentItem[columnNames[columnLoop].replace('.', '')] = dataObject[columnNames[columnLoop]][rowLoop].toString();
                    currentItem.push(dataObject[columnNames[columnLoop]][rowLoop].toString());
                }

                translatedData.push(currentItem);
            }

            return {
                data : translatedData,                
                columns : _.map(columnNames, function(col) { return { 'title' : col }})
            };
        };
    };

    return DataTableTranslator;

});