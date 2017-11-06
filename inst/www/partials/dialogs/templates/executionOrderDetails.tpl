<% _.forEach(orderDetails, function(page) { %>
    <% _.forEach(page.controls, function(control) {%>
        
        <% if(control.label == 'Form') { %>
            <% _.forEach(control.childControls, function(childControl) {%>
            <tr>
                <td><%= page.navigationTitle %></td>
                <td>Form <%= childControl.label %></td>
                <td><%= _.filter(childControl.controlProperties, function(prop) { return prop.uid == 'variablename' || prop.uid == 'code' })[0].value %></td>
                <td><input type="text" data-controlid="<%=childControl.id%>" value="<%=childControl.executionOrder%>" /></td>
            </tr>
            <% }); %>
        <% } else { %>
            <tr>
                <td><%= page.navigationTitle %></td>
                <td><%= control.label %></td>
                <td><%= _.filter(control.controlProperties, function(prop) { return prop.uid == 'variablename' || prop.uid == 'code' })[0].value %></td>
                <td><input type="text" data-controlid="<%=control.id%>" value="<%=control.executionOrder%>" /></td>
            </tr>
        <% } %>
    <% }); %>    
<% }); %>