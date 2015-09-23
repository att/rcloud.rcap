<ul class="rcap-pageMenu">
<% _.each(pages, function(p){ %>
    <li <%= siteCurrentPageID === p.id ? ' class="current"' : ''%>><a href="javascript:void(0)" data-href="<%=p.navigationTitle%>"><%=p.navigationTitle%></a></li>
<% }); %>    
</ul>