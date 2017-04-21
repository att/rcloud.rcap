<%
if(typeof control.controlProperties[0].value !== 'undefined' && control.controlProperties[0].value.length > 0)  {
%>
  <label for="<%=control.id%>">
      <%=control.controlProperties[0].value%>
  </label>
<% } %>

<select id="<%=control.id%>" data-variablename="<%=control.controlProperties[1].value%>" data-label="<%= control.getPropertyValue('label') %>" data-selectiontype="<%= control.getPropertyValue('selectionStyle') %>">
<%
	if( control.controlProperties[2].optionType == 'manual') {
%>
  <% _.each(control.controlProperties[2].value, function(o, i){ %>
  	<option value="<%=o.label%>" ><%=o.label%></option>
  <% }); %>

<% } else { %>

	<% if(isDesignTime) { %>

		<option value="">{{ Runtime generated }}</option>

	<% } %>

<% } %>

</select>
