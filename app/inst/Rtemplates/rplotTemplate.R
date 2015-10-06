<%=control.id%> <- function(jsArgs=list(width=500,height=500)) {
  
  # Get the width and height from the client
  if (!is.null(jsArgs$width)) width=jsArgs$width
  if (!is.null(jsArgs$height)) height=jsArgs$height
  
  # Start a webplot device
  wp1 <- WebPlot(width=width,height=height)
  
  # Function call from the control goes here
  <%=control.controlProperties.1%>
  
  # Output the plot to the right div
  rcloud.web::rcw.set("#<%=control.id%>", wp1)

}
