

    <!-- TODO : update so it looks good ;) -->

		<% _.each(control.radioButtonOptions, function(o, i){ %>

			<label for="radio-<%=control.id%><%=i%>"><%=o.label%></label>
			<input type="radio" name="radio-<%=control.id%>" id="radio-<%=control.id%><%=i%>" value="<%=o.value%>" <%= control.value === o.value ? ' checked="checked"' : ''%>><br>

        <% }); %>    
   
