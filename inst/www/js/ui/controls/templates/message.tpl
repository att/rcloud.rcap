<div class="message" id="<%=control.id%>" data-variablename="<%=control.getPropertyValue('variablename')%>" data-controltype="dataupload">
    <% if(isDesignTime) { %>
        <i class="icon-comment"></i> <% if(control.getPropertyValue('variablename')) { %><- <%=control.getPropertyValue('variablename')%><% } %>
	<% } else { %>
        <!-- runtime generated -->
	<% } %>
</div>
