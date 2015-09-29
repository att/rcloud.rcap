<!-- <div class="box-shadow-menu">Menu</div> -->

<% if(control.controlProperties[1].value === 'hamburger') { %>

<ul class="rcap-pagemenu rcap-pagemenu-<%=control.controlProperties[0].value%>">
<% _.each(control.pages, function(p){ %>
    <li <%= control.currentPageID === p.id ? ' class="current"' : ''%>><a href="javascript:void(0)" data-pageid="<%=p.id%>" data-href="<%=p.navigationTitle%>"><%=p.navigationTitle%></a></li>
<% }); %>    
</ul>

<% } else if(['horizontal', 'vertical'].indexOf(control.controlProperties[1].value) !== -1) { %>

<nav class="hamburger">
  <button>Toggle</button>
  <div>
  	<% _.each(control.pages, function(p){ %>
	    <a href="javascript:void(0)" data-pageid="<%=p.id%>" data-href="<%=p.navigationTitle%>"><%=p.navigationTitle%></a>
	<% }); %>  
  </div>
</nav>

<% } %>


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