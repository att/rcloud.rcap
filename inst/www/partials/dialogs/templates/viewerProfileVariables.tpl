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
      <tr data-variablename="<%=o.name%>" data-id="<%=o.id%>">
        <td><%=o.description%></td>
        <td class="selection-method">
          <select>
            <option value="all">I want to get all the values</option>
            <option value="selected"<%= _.findWhere(o.options, { selected: true }).length !== 0 ? ' selected="selected"' : ''%>>I want to get the selected values</option>
          </select>
        </td>
        <td class="values">
         <select multiple="multiple"<%= _.findWhere(o.options, { selected: true }).length === 0 ? ' style="display:none"' : ''%>>
            <% _.each(o.options, function(option, i) { %>
              <option value="<%=option.value%>" <%= option.selected ? ' selected="selected"' : ''%>><%=option.value%></option>
            <% }); %>
          </select>
        </td>
      </tr>
    <% }); %>
  </tbody>
</table>






<!--
<label>
  Variable:
  <select>
    <% _.each(profileDataItems, function(o, i){ %>
      <option value="<%o.name%>" data-value="<%o.name%>"><%=o.description%></option>
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

      <select class="js-example-basic-multiple" multiple="multiple">
        <% _.each(o.options, function(option, i) { %>
          <option value="<%=option.value%>"><%=option.value%></option>
        <% }); %>
      </select>

    </fieldset>
  </div>
<% }); %>
-->
