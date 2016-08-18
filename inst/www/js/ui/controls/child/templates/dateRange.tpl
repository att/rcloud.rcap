<% 
if(typeof control.controlProperties[0].value !== 'undefined' && control.controlProperties[0].value.length > 0)  { 
%>
<label for="<%=control.id%>">
    <%=control.controlProperties[0].value%>
</label>

<% } %>


<input type="date" id="<%=control.id%>" data-variablename="<%=control.controlProperties[1].value%>"></input> to <input type="date" id="<%=control.id%>" data-variablename="<%=control.controlProperties[2].value%>"></input>