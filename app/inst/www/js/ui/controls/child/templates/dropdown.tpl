<label for="<%=control.id%>">
<% 
    if(typeof control.controlProperties[0].value !== 'undefined' && control.controlProperties[0].value.length > 0)  { 
%>
    <%=control.controlProperties[0].value%>
    <% } else {%>

    <%=control.controlProperties[0].defaultValue%>
<% } %>
</label>






<select id="<%=control.id%>">


<%
	if( control.controlProperties[2].optionType == 'manual') {
%>

		<% _.each(control.controlProperties[2].value, function(o, i){ %>

			<option value="<%=o.value%>" ><%=o.label%></option>

       <% }); %>  

<% } else { %>

	<!-- if it's design time -->
	<% if(isDesignTime) { %>

		<option value="">This dropdown's items will be rendered at runtime</option>

	<% } else { %>

		<!-- do some funky stuff -->

	<% } %>

<% } %>

</select>





