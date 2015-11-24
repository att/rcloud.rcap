<li class="js-rcap-dynamic" data-datasourceid="<%=ds.id%>"> 
    <a href="javascript:void(0)">
    	<%if(ds.variable || ds.function) {%>
			Variable: <%=ds.variable%>
            <br />
            Function: <%=ds.function%>
    	<%} else {%>
    		This data source is not configured
    	<%}%>
        <span class="datasource-settings" title="Modify data source">Settings</span> 
    </a>
</li>