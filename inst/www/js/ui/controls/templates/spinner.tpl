<div class="spinner" id="<%=control.id%>" data-variablename="<%=control.getPropertyValue('variablename')%>" data-controltype="spinner">
<% if(isDesignTime) { %>
        <i class="icon-spinner"></i> <% if(control.getPropertyValue('variablename')) { %><- <%=control.getPropertyValue('variablename')%><% } %>
<% } else { %>
        <img src="/shared.R/rcloud.rcap/img/spinner.gif" class="spinner" />
        <span class="spinner message"></span>
<% } %>
</div>
