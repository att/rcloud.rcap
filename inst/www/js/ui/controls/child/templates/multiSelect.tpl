<% 
if(typeof control.controlProperties[0].value !== 'undefined' && control.controlProperties[0].value.length > 0)  { 
%>
<label for="<%=controlId%>">
    <%=control.controlProperties[0].value%>
</label>
<% } %>

<select id="<%=controlId%>" data-variablename="<%=control.controlProperties[2].value%>" multiple="multiple">
<%
	if( control.controlProperties[3].optionType == 'manual') {
%>
	<% _.each(control.controlProperties[3].value, function(o, i){ %>
		<option value="<%=o.label%>"><%=o.label%></option>
	<% }); %>  
<% } else { %>
	<% if(isDesignTime) { %>
		<option value="">{{ Runtime generated }}</option>
	<% } %>
<% } %>
</select>

<script type="text/javascript">

	$('#<%=controlId%>').select2({ 
		width : '250px',
		placeholder: '<%=control.getPropertyValueOrDefault('placeholder')%>'
	}); 

	$('#<%=controlId%> + .select2').find('.select2-search__field').removeAttr('style');

</script>