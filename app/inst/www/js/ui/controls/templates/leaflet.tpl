<%if(typeof control.controlProperties[1].value != 'undefined' && control.controlProperties[1].value.length) {%>
    <a href="<%=control.controlProperties[1].value%>" target="<%=control.controlProperties[2].value%>">
        <div id="<%=control.id%>" class="leaflet">Please wait while the map is loaded...</div>
    </a>
<%} else {%>
    <div id="<%=control.id%>" class="leaflet">Please wait while the map is loaded...</div>
<% } %>