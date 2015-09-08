<div id="svgcontainer-<%=control.id%>" class="dt">  

  <svg class="graph" id="svg-<%=control.id%>" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 800 500" width="100%" height="100%" preserveAspectRatio="none">
   <g>
      <g class="grid x-grid" id="xGrid">
        <line x1="113" x2="113" y1="10" y2="380"></line>
        <line x1="259" x2="259" y1="10" y2="380"></line>
        <line x1="405" x2="405" y1="10" y2="380"></line>
        <line x1="551" x2="551" y1="10" y2="380"></line>
        <line x1="697" x2="697" y1="10" y2="380"></line>
      </g>
      <g class="grid y-grid" id="yGrid">
        <line x1="86" x2="697" y1="10" y2="10"></line>
        <line x1="86" x2="697" y1="68" y2="68"></line>
        <line x1="86" x2="697" y1="126" y2="126"></line>
        <line x1="86" x2="697" y1="185" y2="185"></line>
        <line x1="86" x2="697" y1="243" y2="243"></line>
        <line x1="86" x2="697" y1="301" y2="301"></line>
        <line x1="86" x2="697" y1="360" y2="360"></line>
      </g>
      
      
      <g class="surfaces">
          <path class="first_set" d="M113,360 L113,192 L259,171 L405,179 L551,200 L697,204 L697,360 Z"></path>
      </g>
      
      <use class="grid double" xlink:href="#xGrid" style=""></use>
      <use class="grid double" xlink:href="#yGrid" style=""></use>
      
      <g class="first_set points" data-setname="">
        <circle cx="113" cy="192" data-value="7.2" r="5"></circle>
        <circle cx="259" cy="171" data-value="8.1" r="5"></circle>
        <circle cx="405" cy="179" data-value="7.7" r="5"></circle>
        <circle cx="551" cy="200" data-value="6.8" r="5"></circle>
        <circle cx="697" cy="204" data-value="6.7" r="5"></circle>
      </g>
    </g>     
      
  </svg>

</div>
<script type="text/javascript">
$(window).resize(function() {
       
    $('#svg-<%=control.id%>').css({
        'width': $('#svgcontainer-<%=control.id%>').width() + 'px',
        'height': $('#svgcontainer-<%=control.id%>').height() + 'px'
    });
    
});
</script>