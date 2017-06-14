
<% if(hasStaleItem) { %>
  <div class="warning">
    <% _.each(profileDataItems, function(o, i){ %>
      <% if(o.staleValues.length) { %>
        <h4>
        Your saved selection (<% _.each(o.staleValues, function(staleValue) { %>
          <span class="stale"><%=staleValue%></span>
        <% }); %>) for variable '<%=o.description%>' <%= (o.allStale) ? ' was not found in the currently available values.' : ' has some values that are no longer current.' %>
        </h4>
      <% } %>
    <% }); %>
  </div>
<% } %>

<table>
  <thead>
    <tr>
      <td>Variable</td>
      <td>Selection method</td>
      <td>Values</td>
    </tr>
  </thead>
  <tbody>
    <% _.each(profileDataItems, function(o, i){ %>
      <tr data-variablename="<%=o.name%>" data-id="<%=o.id%>" data-valuehash="<%=o.valueHash%>">
        <td><%=o.description%></td>
        <td class="selection-method">
          <select id="<%=o.id%>">
            <option value="all"<%= o.all ? ' selected="selected"' : ''%>>All values</option>
            <option value="selected"<%= !o.all ? ' selected="selected"' : ''%>>Selection</option>
          </select>
        </td>
        <td class="values">
          <div data-selectionmethod="all" <%= !o.all ? ' style="display:none"' : ''%>">All</div>
          <div data-selectionmethod="selected" <%= o.all ? ' style="display:none"' : ''%>>
            <select multiple="multiple">
              <% _.each(o.options, function(option, i) { %>
                <option value="<%=option.value%>" <%= option.selected ? ' selected="selected"' : ''%>><%=option.value%></option>
              <% }); %>
            </select>
          </div>
          <div class="errors" />
        </td>
      </tr>
    <% }); %>
  </tbody>
</table>
