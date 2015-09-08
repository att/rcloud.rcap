<label for="<%=control.id%>">
<% 
    if(typeof control.controlProperties[0].value !== 'undefined' && control.controlProperties[0].value.length > 0)  { 
%>
    <%=control.controlProperties[0].value%>
    <% } else {%>

    <%=control.controlProperties[0].defaultValue%>
<% } %>
</label>
<input type="date" id="<%=control.id%>"></input>