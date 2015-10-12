<%=control.id%> <- function(jsArgs=list(width=500,height=500)) {

  # Unroll the arguments from the client
  if (!is.null(jsArgs$width)) width=jsArgs$width
  if (!is.null(jsArgs$height)) height=jsArgs$height
  
  # Trap errors at run time
  error <- try({})
    library(rcloud.dcplot)
    x <- <%=control.controlProperties.1%>
  })

  if(class(error)=="try-error") {
    # Create an error output
    errorMsg <- paste0("<pre class=\"rcaperror\">", error, "</pre>")
    rcloud.web::rcw.set("#<%=control.id%>", errorMsg)
    
  } else {
    rcloud.web::rcw.set("#<%=control.id%>", rcloud.web::rcw.resolve(x))
  }
}
# Must end with a line break
