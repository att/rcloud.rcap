<div id="select-options" class="overlay">
  <a href="javascript:void(0)" class="close">&times;</a>
  <div class="overlay-content">
    <% _.each(values, function(o, i){ %>
      <a href="#" <%= o.selected ? ' class="selected"' : ''%>"><%=o.value%></a>
    <% }); %>
  </div>
</div>
