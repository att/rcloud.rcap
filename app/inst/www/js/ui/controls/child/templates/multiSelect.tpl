<% 
if(typeof control.controlProperties[0].value !== 'undefined' && control.controlProperties[0].value.length > 0)  { 
%>
<label for="<%=controlId%>">
    <%=control.controlProperties[0].value%>
</label>
<% } %>

<select id="<%=controlId%>" data-variablename="<%=control.controlProperties[1].value%>" multiple="multiple">


<%
	if( control.controlProperties[3].optionType == 'manual') {
%>

		<% _.each(control.controlProperties[3].value, function(o, i){ %>

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
<script type="text/javascript">

	$('#<%=controlId%>').select2({ 
		width : '250px',
		placeholder: '<%=control.getControlPropertyValueOrDefault('placeholder')%>'
	}); 

</script>