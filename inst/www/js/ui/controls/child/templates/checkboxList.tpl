<h3><%=control.controlProperties[0].value%></h3>
<div class="checkbox-group" id="<%=control.id%>" data-variablename="<%=control.controlProperties[1].value%>">
  <% if( control.controlProperties[2].optionType == 'manual') { %>
  	<% _.each(control.controlProperties[2].value, function(o, i){ %>
      <div class="form-option">
        <label><input type="checkbox" name="checbox-<%=control.id%>" value="<%=o.label%>" <%= control.value === o.value ? ' checked="checked"' : ''%>><%=o.label%></label>
      </div>
    <% }); %>
  <% } else { %>
	<% if(isDesignTime) { %>
    <label><input type="checkbox" name="des-<%=control.id%>">{{ Runtime generated }}</label>
	<% } else { %>
    <!-- runtime generated -->
	<% } %>
<% } %>
</div>
