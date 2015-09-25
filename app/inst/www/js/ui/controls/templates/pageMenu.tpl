<!-- <div class="box-shadow-menu">Menu</div> -->

<ul class="rcap-pagemenu rcap-pagemenu-<%=control.controlProperties[0].value%>">
<% _.each(control.pages, function(p){ %>
    <li <%= control.currentPageID === p.id ? ' class="current"' : ''%>><a href="javascript:void(0)" data-pageid="<%=p.id%>" data-href="<%=p.navigationTitle%>"><%=p.navigationTitle%></a></li>
<% }); %>    
</ul>




<!-- 
<div class="mobile-nav">
	<div class="menu-btn" id="menu-btn">
		<div></div>
		<span></span>
		<span></span>
		<span></span>
	</div>
	<div class="responsive-menu">
		<ul>
			<% _.each(control.pages, function(p){ %>
			    <li <%= control.currentPageID === p.id ? ' class="current"' : ''%>><a href="javascript:void(0)" data-pageid="<%=p.id%>" data-href="<%=p.navigationTitle%>"><%=p.navigationTitle%></a></li>
			<% }); %> 
		</ul>
	</div>
</div> -->