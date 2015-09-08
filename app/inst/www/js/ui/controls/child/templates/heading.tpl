<<%=control.controlProperties[1].value%>>
<% 
	if(typeof control.controlProperties[0].value !== 'undefined' && control.controlProperties[0].value.length > 0)  { 
%>
    <%=control.controlProperties[0].value%>
    <% }else {%>

    <%=control.controlProperties[0].defaultValue%>
<% } %>
        
    </<%=control.controlProperties[1].value%>>