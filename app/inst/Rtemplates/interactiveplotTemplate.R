<%=control.id%> <- function(jsArgs=list(width=500,height=500)) {

  # Unroll the arguments from the client
  if (!is.null(jsArgs$width)) width=jsArgs$width
  if (!is.null(jsArgs$height)) height=jsArgs$height
  
  library(rcloud.dcplot)
  x <- <%=control.controlProperties.1%>
    
  rcloud.web::rcw.set("#<%=control.id%>", rcloud.web::rcw.resolve(x))
  
}
# Must end with a line break
