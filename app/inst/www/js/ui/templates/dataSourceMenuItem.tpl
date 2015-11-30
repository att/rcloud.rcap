<li class="js-rcap-dynamic" data-datasourceid="<%=ds.id%>"> 
    <a href="javascript:void(0)">
        <i class="icon-hdd"></i>
    	<%if(ds.variable || ds.function) {%>
            Function: <%=ds.code%>			
            <br />
            Variable: <%=ds.variable%>
    	<%} else {%>
    		This data source is not configured
    	<%}%>
        <span class="datasource-settings" title="Configure data source">Settings</span> 
    </a>
</li>