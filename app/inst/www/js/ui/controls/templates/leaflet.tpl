<%if(typeof control.controlProperties[1].value !== 'undefined' && control.controlProperties[1].value.length) {%>
    <div id="<%=control.id%>" class="leaflet">Please wait while the map is loaded...</div>
    <div class="leaflet-overlay" style="position:absolute;top:0;left:0;width:100%;height:100%;z-index:1001;cursor:pointer"></div>
<%} else {%>
    <div id="<%=control.id%>" class="leaflet">Please wait while the map is loaded...</div>
<% } %>


<%if(typeof control.controlProperties[1].value !== 'undefined' && control.controlProperties[1].value.length) {%>
<script type="text/javascript">
    $('#<%=control.id%>').next('.leaflet-overlay').click(function() {
        location.replace('<%=control.controlProperties[1].value%>');
    });
</script>
<% } %>