<div class="controls-menu">
<% _.each(controlCategories, function(category){ %>
    <h5><%=category.type%></h5>
    <ul class="controls">
	<% _.each(category.controls, function(control){ %>
	    <li data-type="<%=control.type%>">
	        <a href="#" class="control-<%=control.type %>" title="Add <%=control.label%>">
	            <i class="icon-<%=control.icon%>"></i>
	            <p><%= control.label %></p>
	        </a>
	    </li>
	<% }); %>
    </ul>
<% }); %>
</div>