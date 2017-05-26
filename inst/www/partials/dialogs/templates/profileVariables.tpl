<table>
  <thead>
    <tr>
      <th>Variable name</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <% _.each(profileVariables, function(o, i){ %>
      <tr>
        <td><label for="var-<%=o.name%>"><%=o.name%></label></td>
        <td>
          <input type="text" id="var-<%=o.name%>" data-name="<%=o.name%>" value="<%=o.value%>" />
        </td>
      </tr>
    <% }); %>
  </tbody>
</table>
