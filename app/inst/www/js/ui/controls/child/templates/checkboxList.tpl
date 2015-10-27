

    <!-- TODO : update so it looks good ;) -->

<h3><%=control.controlProperties[0].value%></h3>

<%
	if( control.controlProperties[2].optionType == 'manual') {
%>
	<!-- manual -->
	<% _.each(control.controlProperties[2].value, function(o, i){ %>

		<label for="checkbox-<%=control.id%><%=i%>"><%=o.label%></label>
		<input type="checkbox" name="checkbox-<%=control.id%>" id="checkbox-<%=control.id%><%=i%>" value="<%=o.value%>" <%= control.value === o.value ? ' checked="checked"' : ''%>><br>

	<% }); %>    


<% } else { %>

	<!-- if it's design time -->
	<% if(isDesignTime) { %>

		<input type="checkbox" style="cursor:help" title="<%=control.controlProperties[2].value%>">{{ Runtime generated }}</input>

	<% } else { %>

		<!-- do some funky stuff -->

	<% } %>

<% } %>


    

		
   
