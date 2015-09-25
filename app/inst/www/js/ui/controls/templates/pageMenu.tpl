<ul class="rcap-pageMenu">
<% _.each(pages, function(p){ %>
    <li <%= currentPageID === p.id ? ' class="current"' : ''%>><a href="javascript:void(0)" data-pageid="<%=p.id%>" data-href="<%=p.navigationTitle%>"><%=p.navigationTitle%></a></li>
<% }); %>    
</ul>