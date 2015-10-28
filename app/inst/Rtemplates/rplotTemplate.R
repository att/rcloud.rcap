<%=control.id%> <- function(jsArgs=list(width=500,height=500)) {
  
  # Get the width and height from the client
  if (!is.null(jsArgs$width)) width=jsArgs$width
  if (!is.null(jsArgs$height)) height=jsArgs$height
  
  # Start a webplot device
  #wp1 <- WebPlot(width=width,height=height)
  
  contextId <- rcloud.support::rcloud.output.context("#<%=control.id%>")
  Rserve::Rserve.context(contextId)
  
  rcloud.support::RCloudDevice(floor(width), floor(height))
  rcloud.support::rcloud.html.out(paste("width", width, "height", height))
  
  # Catch errors
  error <- try({
    
    # Function call from the control goes here
    <%=control.controlProperties.1%>
  })
  
  if(class(error)=="try-error") {
    # Create an error output
    errorMsg <- paste0("<pre class=\"rcaperror\">", error, "</pre>")
    rcloud.support::rcloud.html.out(errorMsg)
  #  rcloud.web::rcw.set("#<%=control.id%>", errorMsg)
  } else {
    # Update the right div
  #  rcloud.web::rcw.set("#<%=control.id%>", wp1)
  }
  
  # Flush the plot
  rcloud.support::rcloud.flush.plot()
  
}
