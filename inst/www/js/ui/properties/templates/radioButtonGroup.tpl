<div class="form-group" id="form-group-<%=property.id%>">

		<% _.each(property.radioButtonOptions, function(o, i){ %>

			<label for="radio-<%=property.id%><%=i%>"><%=o.label%></label>
			<input type="radio" name="radio-<%=property.id%>" id="radio-<%=property.id%><%=i%>" value="<%=o.value%>" <%= property.value === o.value ? ' checked="checked"' : ''%>><br>

        <% }); %>    
   
</div>