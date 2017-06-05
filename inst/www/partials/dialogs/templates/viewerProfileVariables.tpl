<label>
  Variable:
  <select>
    <% _.each(profileDataItems, function(o, i){ %>
      <option value="<%o.name%>" data-value="<%o.name%>"><%=o.name%></option>
    <% }); %>
  </select>
</label>

<% _.each(profileDataItems, function(o, i){ %>
  <div class="options-panel" style="display: none" data-variablename="<%=o.name%>" data-id="<%=o.id%>">
    <fieldset>
      <legend>Variable options</legend>
      <div class="errors" />
      <div class="buttons">
        <button data-action="all">Select all</button>
        <button data-action="none">Select none</button>
      </div>
      <% _.each(o.options, function(option, i) { %>
          <label><input type="checkbox" <%= i === 0 ? ' data-parsley-required ' : ''%> id="<%=o.name%><%=option.value%>" name="<%=o.name%>[]" value="<%=option.value%>" <%= option.selected ? ' checked="checked"' : ''%>><%=option.value%></label>
        <% }); %>
    </fieldset>
  </div>
<% }); %>
