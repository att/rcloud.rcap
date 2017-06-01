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
        <td><input type="text" id="var-<%=o.name%>" data-name="<%=o.name%>" value="<%=o.value%>" /></td>
        <td><input type="text" id="var-<%=o.code%>" data-name="<%=o.name%>" value="<%=o.code%>" /></td>
        <td><input type="text" id="var-<%=o.description%>" data-name="<%=o.description%>" value="<%=o.description%>" /></td>
        <td><i class="icon-remove-sign"></i></td>
      </tr>
    <% }); %>
  </tbody>
</table>

