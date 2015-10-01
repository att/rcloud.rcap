
parseConfig <- function(rcapConfig) {
  
  if (!is.null(rcapConfig$pages)) {
    return(lapply(rcapConfig$pages, parsePage))
  } else {
    return(list())
  }
  
}

parsePage <- function(rcapPage) {
  
  # Check for child pages
  if(!is.null(rcapPage$pages)) {
    childFunctions <- lapply(rcapPage$pages, parsePage)
  } else {
    childFunctions <- list()
  }
  
  # Now check for controls
  if (!is.null(rcapPage$controls)) {
    pageFunctions <- lapply(rcapPage$controls, parseControl)
  } else {
    pageFunctions <- list()
  }
  
  return(list(childFunctions=childFunctions, pageFunctions=pageFunctions))
  
}

parseControl <- function(rcapControl) {
  
  # Apply the class from the type if available
  if (!is.null(rcapControl$type)) {
    attr(rcapControl, "class") <- rcapControl$type
  }
  
  return(processControl(rcapControl))
  
}