<% 
if(typeof control.controlProperties[0].value !== 'undefined' && control.controlProperties[0].value.length > 0)  { 
%>
<label for="<%=control.id%>">
    <%=control.controlProperties[0].value%>
</label>

<% } %>

<div class="daterange" data-variablename="<%=control.controlProperties[1].value%>" id="<%=control.id%>">
    <input type="date" id="<%=control.id%>-start"></input> to <input type="date" id="<%=control.id%>-end"></input>
</div>