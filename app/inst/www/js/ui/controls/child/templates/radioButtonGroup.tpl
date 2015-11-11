

    <h3><%=control.controlProperties[0].value%></h3>

<div class="radiobutton-group" id="<%=control.id%>" data-variablename="<%=control.controlProperties[1].value%>">


<%
	if( control.controlProperties[2].optionType == 'manual') {
%>




		<% _.each(control.controlProperties[2].value, function(o, i){ %>
<div class="form-option">
			<label for="radio-<%=control.id%><%=i%>"><%=o.label%></label>
			<input type="radio" name="radio-<%=control.id%>" id="radio-<%=control.id%><%=i%>" value="<%=o.label%>" <%= control.value === o.value ? ' checked="checked"' : ''%>>
</div>
        <% }); %>    



<% } else { %>

	<!-- if it's design time -->
	<% if(isDesignTime) { %>

		<label for="des-<%=control.id%>">{{ Runtime generated }}</label>
		<input type="radio" name="des-<%=control.id%>" id="des-<%=control.id%>" value="">


	<% } else { %>


		<!-- do some funky stuff -->


	<% } %>

<% } %>

</div>