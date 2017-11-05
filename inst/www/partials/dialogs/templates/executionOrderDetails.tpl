<% _.forEach(orderDetails, function(page) { %>
    <% _.forEach(page.controls, function(control) {%>
        
        <% if(control.controlType == 'Form') { %>
            <% _.forEach(control.childControls, function(childControl) {%>
            <tr>
                <td><%= page.navigationTitle %></td>
                <td>Form <%= childControl.label %></td>
                <td>** todo **</td>
                <td><input type="number" /></td>
            </tr>
            <% }); %>
        <% } else { %>
            <tr>
                <td><%= page.navigationTitle %></td>
                <td><%= control.controlType %></td>
                <td>** todo **</td>
                <td><input type="number" /></td>
            </tr>
        <% } %>
    <% }); %>    
<% }); %>