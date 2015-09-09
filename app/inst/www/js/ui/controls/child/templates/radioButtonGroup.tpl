

    <h3><%=control.controlProperties[0].value%></h3>




<%
	if( control.controlProperties[2].optionType == 'manual') {
%>




		<% _.each(control.controlProperties[2].value, function(o, i){ %>

			<label for="radio-<%=control.id%><%=i%>"><%=o.label%></label>
			<input type="radio" name="radio-<%=control.id%>" id="radio-<%=control.id%><%=i%>" value="<%=o.value%>" <%= control.value === o.value ? ' checked="checked"' : ''%>><br>

        <% }); %>    
   


<% } else { %>

	<!-- if it's design time -->
	<% if(isDesignTime) { %>

		<label for="des-<%=control.id%>">This radio button group's items will be rendered at runtime</label>
		<input type="radio" name="des-<%=control.id%>" id="des-<%=control.id%>" value="">


	<% } else { %>

		<!-- do some funky stuff -->

	<% } %>

<% } %>