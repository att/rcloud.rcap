<ul class="rcap-pagemenu rcap-pagemenu-<%=control.controlProperties[0].value%>">
<% _.each(control.pages, function(p){ %>
	<% if(p.isEnabled) { %>
    <li <%= control.currentPageID === p.id ? ' class="current"' : ''%>><a href="javascript:void(0)" data-pageid="<%=p.id%>" data-href="<%=p.navigationTitle%>"><%=p.navigationTitle%></a></li>
    <% } %>
<% }); %>    
</ul>