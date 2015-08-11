define([
   'controls/factories/controlFactory'
], function(ControlFactory) {

'use strict';

    var MenuManager = Class.extend({
        init : function() {

        },
        initialiseControlsMenu : function() {
            var controlFactory = new ControlFactory();
            var controls = controlFactory.getAll();
            var templateStr = '<% _.each(controls, function(control){ %><li data-type="<%=control.type%>"><a href="#" class="control-<%=control.type %>" title="Add <%=control.type%>"><%= control.label %></a></li><% }); %>'; 
            var template = _.template(templateStr);
            $('.menu #controls').append(template({
                controls: controls
            }));
        }
    });

    return MenuManager;

});
