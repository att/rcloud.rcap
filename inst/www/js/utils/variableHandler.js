define(['rcap/js/utils/rcapLogger'], function(RcapLogger) {

    'use strict';

    return {
        submitChange: function(variableData) {

            if(!variableData) {
                return;
            }

            if(!_.isArray(variableData)) {
                variableData = [variableData];
            }
            
            if(variableData.length) {
                var plotSizes = [];

                $('.rplot, .r-interactiveplot, .rhtmlwidget').each(function() {
                    var container = $(this).closest('.grid-stack-item-content');
                    plotSizes.push({
                        id : $(this).attr('id'),
                        width : container.data('width'),
                        height : container.data('height')
                    });
                });

                var dataToSubmit = JSON.stringify({
                    updatedVariables : variableData,
                    plotSizes : plotSizes
                });

                var rcapLogger = new RcapLogger();
                rcapLogger.log('Submitting data: ', dataToSubmit);
                window.RCAP.updateControls(dataToSubmit);
            }

        }
    };

});
