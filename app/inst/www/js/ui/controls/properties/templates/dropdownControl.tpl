<div class="form-group" id="form-group-<%=property.id%>">
    <label for="<%=property.id%>"><%=property.label%></label>

    <select class="form-control" id="<%=property.id%>" <%= property.isRequired ? ' required data-parsley-trigger="change" '  : '' %>>
		<option value="">Select an option</option>
		<% _.each(property.availableOptions, function(o){ %>
            <option value="<%=o.value%>" <%= property.value === o.value ? ' selected="selected"' : ''%>><%=o.text%></option>
        <% }); %>    
    </select>

    <div class="description"><%=property.helpText%></div>
</div>