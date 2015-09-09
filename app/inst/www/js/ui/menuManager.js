define([
   'controls/factories/controlFactory'
], function(ControlFactory) {

    'use strict';

    var controlFactory = new ControlFactory();

    // :::: TODO: refactor code below - both methods are very similar ::::

    var MenuManager = Class.extend({
        init : function() {

        },
        initialiseControlsMenu : function() {
            var controls = controlFactory.getGridControls();
            var templateStr = '<% _.each(controls, function(control){ %><li data-type="<%=control.type%>"><a href="#" class="control-<%=control.type %>" title="Add <%=control.type%>"><%= control.label %></a></li><% }); %>'; 
            var template = _.template(templateStr);
            $('.menu .controls').append(template({
                controls: controls
            }));
        },
        intialiseFormBuilderMenu : function() {
            var childControls = controlFactory.getChildControls();
            var templateStr = '<% _.each(controls, function(control){ %><li data-type="<%=control.type%>"><a href="#" class="control-<%=control.type %>" title="Add <%=control.label%>"><%= control.label %></a></li><% }); %>'; 
            var template = _.template(templateStr);
            $('#dialog-form-builder .controls').append(template({
                controls: childControls
            }));
        }
    });

    return MenuManager;

});
