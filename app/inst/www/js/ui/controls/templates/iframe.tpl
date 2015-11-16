<% if(control.controlProperties[0].value.startsWith('http://')) { %>
	<iframe src="<%=control.controlProperties[0].value%>" id="<%=control.id%>"></iframe>
<% } else { %>
	<iframe src="" id="<%=control.id%>"></iframe>
<% } %>


