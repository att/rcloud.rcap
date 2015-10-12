<li class="js-rcap-dynamic <% if(!p.isEnabled) { %>not-enabled<%}%>" data-pageid="<%=p.id%>"> 
    <a href="#">
        <em class="navigation-title">
            <%=p.navigationTitle%>
        </em> 
        <span class="page-settings" title="Modify page settings">Settings</span> 
        <% if(canAddChild) { %>
        <span class="page-addchild" title="Add child">Add child</span> 
        <% } %>
        <span class="page-duplicate" title="Duplicate this page">Duplicate</span> 
    </a>
    <% if(canAddChild) { %>
    <ol></ol>
    <% } %>
</li>