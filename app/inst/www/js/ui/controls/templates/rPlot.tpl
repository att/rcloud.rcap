<%if(control.controlProperties[1].value.length) {%>
    <a href="<%=control.controlProperties[1].value%>">
        <div id="<%=control.id%>" class="rplot">Please wait while the plot is loaded...</div>
    </a>
<%} else {%>
    <div id="<%=control.id%>" class="rplot">Please wait while the plot is loaded...</div>
<% } %>