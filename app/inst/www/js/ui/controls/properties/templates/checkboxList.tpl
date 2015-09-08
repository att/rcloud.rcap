<div class="form-group" id="form-group-<%=property.id%>">

    <!-- TODO : update so it looks good ;) -->

		<% _.each(property.checkboxListOptions, function(o, i){ %>

			<input type="checkbox" name="checkbox" id="checkbox-<%=property.id%><%=i%>" value="value">
			<label for="checkbox-<%=property.id%><%=i%>"><%=o.label%></label>

        <% }); %>    
   
</div>