<div class="form-group" id="form-group-<%=property.id%>">

		<% _.each(property.checkboxListOptions, function(o, i){ %>

			<input type="checkbox" name="checkbox" id="checkbox-<%=property.id%><%=i%>" value="value">
			<label for="checkbox-<%=property.id%><%=i%>"><%=o.label%></label>

        <% }); %>    
   
</div>