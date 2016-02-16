<div class="settings-menu">
<h5>Site theme</h5>
<select>
<% _.each(themes, function(theme){ %>
    <option value="<%=theme.key%>"><%=theme.description%></option>
<% }); %>
</select>
<button>Apply</button>
</div>