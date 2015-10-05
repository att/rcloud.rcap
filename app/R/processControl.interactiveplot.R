#' @rdname processControl
#' @method processControl interactiveplot
processControl.interactiveplot <- function(rcapControl) {
  
  funName <- rcapControl$id
  funText <- paste0(funName, " <- function(jsArgs=list(width=500,height=500)) {")
  
  funText <- c(funText, "  if (!is.null(jsArgs$width)) width=jsArgs$width")
  funText <- c(funText, "  if (!is.null(jsArgs$height)) height=jsArgs$height")
  funText <- c(funText, "  library(rcloud.dcplot)")
  
  funText <- c(funText, paste0("  x <- ", rcapControl$controlProperties[[1]]$value))
  
  funText <- c(funText, paste0("  rcloud.web::rcw.set(\"#",rcapControl$id,"\", rcloud.web::rcw.resolve(x))}"))
  
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