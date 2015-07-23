define([
    'json!rcap/js/config/controls.json'
], function(configJson) {

    'use strict';

    return {
        initialise: function() {
            console.log('Menu has been initialised'); 
            console.log(configJson);

            // define the underscore template:
            var templateStr = '<% _.each(controls, function(control){ %><li><a href="#" class="control-<%=control.type %>" title="Add <%=control.type%>"><%= control.label %></a></li><% }); %>'; 

            // use the configJson to build the html:
            var template = _.template(templateStr);

            //var transformed = template({
            //	controls: configJson.controls
            //});

            //console.log(transformed);
            $('.menu #controls').append(template({
            	controls: configJson.controls
            }));

        }

    };

});
