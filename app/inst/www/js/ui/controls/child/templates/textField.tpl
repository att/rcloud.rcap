<% 
if(typeof control.controlProperties[0].value !== 'undefined' && control.controlProperties[0].value.length > 0)  { 
%>
<label for="<%=control.id%>">
    <%=control.controlProperties[0].value%>
</label>
<% } %>

<input type="text" value="<%=control.getControlPropertyValueOrDefault('text')%>" id="<%=control.id%>" name="<%=control.getControlPropertyValueOrDefault('variablename')%>" data-variablename="<%=control.getControlPropertyValueOrDefault('variablename')%>"></input>