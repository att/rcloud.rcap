<% if(['horizontal', 'vertical'].indexOf(control.controlProperties[0].value) !== -1) { %>
	<ul class="rcap-pagemenu rcap-pagemenu-<%=control.controlProperties[0].value%>">
	<% _.each(control.pages, function(p){ %>
		<% if(p.isEnabled) { %>
	    <li <%= control.currentPageID === p.id ? ' class="current"' : ''%>><a href="javascript:void(0)" data-pageid="<%=p.id%>" data-href="<%=p.navigationTitle%>"><%=p.navigationTitle%></a></li>
	    <% } %>
	<% }); %>    
	</ul>
<% } else if(control.controlProperties[0].value === 'hamburger') { %>
	<nav class="hamburger hamburger-valign-<%=control.controlProperties[1].value%>">
	  <button>Toggle</button>
	  <div>
	  	<% _.each(control.pages, function(p){ %>
	  		<% if(p.isEnabled) { %>
		    	<a href="javascript:void(0)" data-ishamburger="true" data-pageid="<%=p.id%>" data-href="<%=p.navigationTitle%>"><%=p.navigationTitle%></a>
			<% } %>
		<% }); %>  
	  </div>
	</nav>
<% } %>