processControl <- function(rcapControl) {
  UseMethod("processControl", rcapControl)
}

processControl.default <- function(rcapControl) {
  return(list())
}