<%
if(typeof control.controlProperties[0].value !== 'undefined' && control.controlProperties[0].value.length > 0)  {
%>
<label for="<%=control.id%>">
    <%=control.controlProperties[0].value%>
</label>
<% } %>

<input type="text" style="width:<%=control.getPropertyValueOrDefault('controlwidth')%>" value="<%=control.getPropertyValueOrDefault('text')%>" id="<%=control.id%>" name="<%=control.getPropertyValueOrDefault('variablename')%>" data-variablename="<%=control.getPropertyValueOrDefault('variablename')%>"></input>
