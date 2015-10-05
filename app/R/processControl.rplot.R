#' @rdname processControl
#' @method processControl rplot
#' 
processControl.rplot <- function(rcapControl) {
  
  funName <- rcapControl$id
  funText <- paste0(funName, " <- function(jsArgs=list(width=500,height=500)) {")
  
  funText <- c(funText, "  if (!is.null(jsArgs$width)) width=jsArgs$width")
  funText <- c(funText, "  if (!is.null(jsArgs$height)) height=jsArgs$height")
  
  funText <- c(funText, "  wp1 <- WebPlot(width=width,height=height)")
  
  funText <- c(funText, rcapControl$controlProperties[[1]]$value)
  
  funText <- c(funText, paste0("  rcloud.web::rcw.set(\"#",rcapControl$id,"\", wp1)}"))
  
  # Make a temporary file
  sourceFile <- tempfile(fileext=".R")
  
  # Write our code to it
  writeLines(funText, sourceFile)
  
  # source has a nice wrapper around eval(parse())
  source(sourceFile)
  
  # Make sure it's gone
  unlink(sourceFile)
  
  return(funName)
  
}