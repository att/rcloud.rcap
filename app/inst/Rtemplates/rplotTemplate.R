<%=control.id%> <- function(jsArgs=list(width=500,height=500)) {
  
  # Get the width and height from the client
  if (!is.null(jsArgs$width)) width=jsArgs$width
  if (!is.null(jsArgs$height)) height=jsArgs$height
  
  # Start a webplot device
  wp1 <- WebPlot(width=width,height=height)
  
  # Catch errors
  error <- try({
    
    # Function call from the control goes here
    <%=control.controlProperties.1%>
  })
  
  if(class(error)=="try-error") {
    # Create an error output
    errorMsg <- paste0("<pre class=\"rcaperror\">", error, "</pre>")
    rcloud.web::rcw.set("#<%=control.id%>", errorMsg)
    
  } else {
    # Output the plot to the right div
    rcloud.web::rcw.set("#<%=control.id%>", wp1)
  }
}
