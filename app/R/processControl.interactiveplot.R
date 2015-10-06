#' @rdname processControl
#' @method processControl interactiveplot
processControl.interactiveplot <- function(rcapControl) {
  
  # The OCAP function name is the control id
  funName <- rcapControl$id
  
  # Pass the contents of the control to the template
  funText <- fillTemplate("interactiveplotTemplate.R",
                          list(control.id=rcapControl$id,
                               control.controlProperties.1=rcapControl$controlProperties[[1]]$value))
  
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