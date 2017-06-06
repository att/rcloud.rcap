<table>
  <thead>
    <tr>
      <th>Variable name</th>
      <th>Function</th>
      <th>Description</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <% _.each(profileVariables, function(o, i){ %>
      <tr>
        <td><input type="text" value="<%=o.controlProperties[0].value%>" /></td>
        <td><input type="text" value="<%=o.controlProperties[1].value%>" data-autocomplete="true" /></td>
        <td><input type="text" value="<%=o.controlProperties[2].value%>" /></td>
        <td><i class="icon-remove-sign remove-row"></i></td>
      </tr>
    <% }); %>
  </tbody>
</table>

