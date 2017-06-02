<select>
  <% _.each(profileDataItems, function(o, i){ %>
    <option value="<%o.name%>"><%=o.name%></option>
  <% }); %>
</select>

<% _.each(profileDataItems, function(o, i){ %>
  <div class="options-panel" style="display: none">
  <% _.each(o.options, function(option) { %>
      <label><input type="checkbox" value="<%=option.value%>" <%= option.selected ? ' checked="checked"' : ''%>><%=option.value%></label>
    <% }); %>
  </div>
<% }); %>
